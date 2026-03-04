import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  },
);

// Admin client for background jobs bypassing RLS
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey);
}

export const generateVideo = inngest.createFunction(
  { 
    id: "generate-video",
    retries: 1, // Only retry once to avoid burning credits on persistent errors
    onFailure: async ({ event, error }) => {
        const payload = event.data.event; // The original event is nested in event.data.event during onFailure
        const videoId = payload?.data?.videoId;
        if (videoId) {
            const supabase = createAdminClient();
            await supabase.from("video_generations").update({
                status: 'failed',
                error_message: error.message
            }).eq("id", videoId);
        }
    }
  },
  { event: "video/generate" },
  async ({ event, step }) => {
    const { seriesId } = event.data;

    // 1. Fetch series data from Supabase
    const series = await step.run("fetch-series-data", async () => {
      if (!seriesId) throw new Error("Missing seriesId");
      
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("series_projects")
        .select("*")
        .eq("id", seriesId)
        .single();

      if (error || !data) {
        throw new Error(`Failed to fetch series: ${error?.message}`);
      }
      
      return data;
    });

    // 2. Generate video script using AI
    const scriptResult = await step.run("generate-script", async () => {
        const { GoogleGenAI, Type } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Determine number of image prompts based on duration
        let imageCount = "4 to 5";
        const durationStr = series.duration || "15-30 Seconds";
        if (durationStr.includes("60") || durationStr.includes("70")) {
            imageCount = "5 to 6";
        } else if (durationStr.includes("30") || durationStr.includes("50")) {
            imageCount = "4 to 5";
        }

        const prompt = `
            You are a viral YouTube Shorts and TikTok video script writer.
            Create a highly engaging script for a video.
            
            Video Details:
            - Topic/Niche: ${series.format === 'custom' ? series.custom_topic : series.niche}
            - Custom Instructions: ${series.custom_prompt || 'None'}
            - Video Style: ${series.video_style}
            - Target Duration: ${durationStr}
            
            Requirements:
            1. Write a compelling, natural-sounding script suitable for a voiceover. It should have a strong hook, engaging body, and a call to action. Do not include any stage directions or speaker labels, ONLY the spoken words.
            2. Write a catchy title for the video.
            3. Generate exactly ${imageCount} detailed image generation prompts that match the script's narrative flow and the requested Video Style (${series.video_style}). These will be used to generate the visual scenes.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        script: {
                            type: Type.STRING,
                            description: "The spoken voiceover script, natural and conversational. No stage directions."
                        },
                        title: {
                            type: Type.STRING,
                            description: "A catchy title for the video"
                        },
                        imagePrompts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: `Array of ${imageCount} detailed image generation prompts describing the visual scenes, styled as ${series.video_style}.`
                        }
                    },
                    required: ["script", "title", "imagePrompts"]
                },
            }
        });

        const text = response.text;
        if (!text) throw new Error("Failed to generate script: No response from AI model.");

        let parsed;
        try {
             parsed = JSON.parse(text) as { script: string, title: string, imagePrompts: string[] };
        } catch {
             console.error("Failed to parse JSON from AI model", text);
             throw new Error("Failed to parse AI response as JSON");
        }

        // Incremental save
        if (event.data.videoId) {
             const supabase = createAdminClient();
             await supabase.from("video_generations").update({
                 title: parsed.title,
                 script: parsed.script
             }).eq("id", event.data.videoId);
        }

        return parsed;
    });

    // 3. Generate voice using TTS model
    const audio = await step.run("generate-voice", async () => {
        const { createClient: createDeepgramClient } = await import("@deepgram/sdk");
        const deepgram = createDeepgramClient(process.env.DEEPGRAM_API_KEY!);
        
        const textToSpeak = scriptResult.script;
        const voiceModel = series.voice || "aura-asteria-en";

        const response = await deepgram.speak.request(
            { text: textToSpeak },
            {
                model: voiceModel,
                encoding: "linear16",
                container: "wav",
            }
        );

        const stream = await response.getStream();
        if (!stream) {
            throw new Error("Failed to get audio stream from Deepgram");
        }

        // Convert stream to Buffer
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
        }
        const buffer = Buffer.concat(chunks);

        // Upload to Supabase Storage
        const supabase = createAdminClient();
        const fileName = `audio/${seriesId}-${Date.now()}.wav`;
        
        const { error: uploadError } = await supabase.storage
            .from("project_assets")
            .upload(fileName, buffer, {
                contentType: "audio/wav",
                upsert: true
            });

        if (uploadError) {
             throw new Error(`Failed to upload audio to Supabase: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
            .from("project_assets")
            .getPublicUrl(fileName);

        // Duration estimation: roughly 3 words per second for TTS
        const durationEst = Math.ceil(textToSpeak.split(" ").length / 3);

        // Incremental save
        if (event.data.videoId) {
             await supabase.from("video_generations").update({
                 audio_url: publicUrlData.publicUrl
             }).eq("id", event.data.videoId);
        }

        return { 
            audioUrl: publicUrlData.publicUrl, 
            duration: durationEst, 
            textUsed: textToSpeak 
        };
    });

    // 4. Generate captions
    const captionsResult = await step.run("generate-captions", async () => {
        const { createClient: createDeepgramClient } = await import("@deepgram/sdk");
        const deepgram = createDeepgramClient(process.env.DEEPGRAM_API_KEY!);

        if (!audio.audioUrl) {
            throw new Error("No audio URL found to generate captions.");
        }

        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
            { url: audio.audioUrl },
            {
                model: "nova-2",
                smart_format: true,
                punctuate: true,
                utterances: true,
            }
        );

        if (error) {
            throw new Error(`Deepgram transcription error: ${error.message}`);
        }

        const words = result?.results?.channels[0]?.alternatives[0]?.words || [];
        
        // Map down to simpler structure for frontend overlay
        const mappedCaptions = words.map((w: { word: string; start: number; end: number; punctuated_word?: string }) => ({
             word: w.word,
             start: w.start,
             end: w.end,
             punctuated_word: w.punctuated_word || w.word
        }));

        // Incremental save
        if (event.data.videoId) {
             const supabase = createAdminClient();
             await supabase.from("video_generations").update({
                 captions: mappedCaptions
             }).eq("id", event.data.videoId);
        }

        return mappedCaptions;
    });

    // 5. Generate images from image prompt
    const images = await step.run("generate-images", async () => {
        const { default: Replicate } = await import("replicate");
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
        
        const prompts = scriptResult.imagePrompts;
        const supabase = createAdminClient();
        const imageUrls: string[] = [];

        // Generate images sequentially to avoid rate limits on free/lower tiers
        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];
            let buffer: Buffer;

            try {
                // Primary: Try Replicate
                const output = await replicate.run(
                    "google/imagen-4",
                    {
                        input: {
                            prompt: prompt,
                            aspect_ratio: series.aspect_ratio === "16:9" ? "16:9" : "9:16",
                            safety_filter_level: "block_low_and_above"
                        }
                    }
                );

                const replicateImageResult = Array.isArray(output) ? output[0] : output;
                let finalOutputUrl = replicateImageResult;

                if (typeof replicateImageResult === 'object' && replicateImageResult !== null && 'url' in replicateImageResult) {
                     finalOutputUrl = (replicateImageResult as { url: () => string }).url();
                }

                const imageResponse = await fetch(finalOutputUrl as string);
                const arrayBuffer = await imageResponse.arrayBuffer();
                buffer = Buffer.from(arrayBuffer);
            } catch (error) {
                console.error(`Replicate failed for image ${i}, falling back to free API:`, error);
                
                // Fallback: Custom Cloudflare Workers AI (100k free/day)
                const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
                const workerApiKey = process.env.CLOUDFLARE_WORKER_API_KEY;

                if (!workerUrl || workerUrl.includes("YOUR-WORKER-NAME")) {
                    throw new Error("CLOUDFLARE_WORKER_URL is not configured in .env.local");
                }

                const imageResponse = await fetch(workerUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${workerApiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: prompt }),
                });
                
                if (!imageResponse.ok) {
                    const errText = await imageResponse.text();
                    throw new Error(`Cloudflare Worker failed: ${imageResponse.status} ${errText}`);
                }
                
                const fallbackImageArrayBuffer = await imageResponse.arrayBuffer();
                buffer = Buffer.from(fallbackImageArrayBuffer);
            }

            const fileName = `images/${seriesId}-${Date.now()}-${i}.png`;
            const { error: uploadError } = await supabase.storage
                .from("project_assets")
                .upload(fileName, buffer, {
                    contentType: "image/png",
                    upsert: true
                });

            if (uploadError) {
                throw new Error(`Failed to upload image ${i} to Supabase: ${uploadError.message}`);
            }

            const { data: publicUrlData } = supabase.storage
                .from("project_assets")
                .getPublicUrl(fileName);

            imageUrls.push(publicUrlData.publicUrl);
        }

        // Incremental save string image array
        if (event.data.videoId) {
             await supabase.from("video_generations").update({
                 image_urls: imageUrls
             }).eq("id", event.data.videoId);
        }

        return imageUrls;
    });

    // 6. Save everything to database (Finalize)
    const savedData = await step.run("save-generated-video", async () => {
        const supabase = createAdminClient();
        const { videoId } = event.data;

        let videoRecord;

        if (videoId) {
            // Finalize the row to completed
            const { data, error } = await supabase.from("video_generations").update({
                status: 'completed'
            }).eq("id", videoId).select().single();

            if (error) throw new Error(`Failed to update video_generations: ${error.message}`);
            videoRecord = data;
        } else {
             // Fallback: Insert if triggered outside of the API route
            const { data, error } = await supabase.from("video_generations").insert({
                series_id: seriesId,
                user_id: series.user_id,
                title: scriptResult.title,
                script: scriptResult.script,
                audio_url: audio.audioUrl,
                captions: captionsResult,
                image_urls: images,
                status: 'completed'
            }).select().single();

            if (error) throw new Error(`Failed to insert video_generations: ${error.message}`);
            videoRecord = data;
        }

        // Update Series status
        const { error: updateError } = await supabase.from("series_projects").update({
             status: 'completed'
        }).eq("id", seriesId);

        if (updateError) {
             console.error("Failed to update series status, but video generation was saved", updateError);
        }

        return videoRecord;
    });

    return { 
        success: true, 
        seriesId,
        message: "Video generation workflow completed successfully.",
        data: { series, script: scriptResult, audio, captions: captionsResult, images, savedData }
    };
  }
);
