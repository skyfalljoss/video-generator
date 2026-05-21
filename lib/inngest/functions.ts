import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: { event: "test/hello.world" } },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  },
);

const MusicTracks = [
    { id: "mountain", url: "https://ik.imagekit.io/0fkflxaif/bgMusic/the_mountain-background-music-159125.mp3" },
    { id: "lofi-jazz", url: "https://ik.imagekit.io/0fkflxaif/bgMusic/sonican-lo-fi-music-loop-sentimental-jazzy-love-473154.mp3" },
    { id: "nastelbom", url: "https://ik.imagekit.io/0fkflxaif/bgMusic/nastelbom-background-music-463062.mp3" },
    { id: "mfcc", url: "https://ik.imagekit.io/0fkflxaif/bgMusic/mfcc-background-music-484362.mp3" },
    { id: "no-sleep", url: "https://ik.imagekit.io/0fkflxaif/bgMusic/kontraa-no-sleep-hiphop-music-473847.mp3" },
    { id: "nature", url: "https://ik.imagekit.io/0fkflxaif/bgMusic/vkroxstarsinger-nature-music-vkroxstarsinger-226067.mp3" }
];

const getMusicTrackUrl = (id: string) => {
    const track = MusicTracks.find(t => t.id === id);
    return track ? track.url : undefined;
};

// Admin client for background jobs bypassing RLS
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
        global: {
            fetch: (url, options) => {
                return fetch(url, { ...options, cache: "no-store" });
            }
        }
    });
}

export const generateVideo = inngest.createFunction(
  { 
    id: "generate-video",
    retries: 1, // Only retry once to avoid burning credits on persistent errors
    triggers: { event: "video/generate" },
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

    // 6. Render Video via Remotion Lambda
    const videoResult = await step.run("render-video", async () => {
        // Only run if AWS keys are present, otherwise return null
        if (!process.env.REMOTION_AWS_ACCESS_KEY_ID || !process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
            console.warn("Missing AWS credentials for Remotion. Skipping video render.");
            return null;
        }

        const { renderMediaOnLambda, getRenderProgress } = await import("@remotion/lambda/client");

        // The serveUrl must match the one deployed via CLI
        type AwsRegion = Parameters<typeof renderMediaOnLambda>[0]["region"];
        const region = (process.env.REMOTION_AWS_REGION || "us-east-1") as AwsRegion;
        const serveUrl = process.env.REMOTION_SITE_NAME || "short-video-generator";
        
        // AWS function name must match the one deployed with --timeout=900
        const functionName = process.env.REMOTION_FUNCTION_NAME || "remotion-render-4-0-434-mem2048mb-disk2048mb-900sec";

        try {
            const { renderId, bucketName } = await renderMediaOnLambda({
                region,
                functionName,
                serveUrl,
                composition: "MainVideo",
                inputProps: {
                    audioUrl: audio.audioUrl,
                    captions: captionsResult,
                    imageUrls: images,
                    // The DB stores an array of track IDs. For simplicity, we use the first selected track.
                    bgAudioUrl: series.music && series.music.length > 0 
                        ? getMusicTrackUrl(series.music[0]) 
                        : undefined,
                    captionStyle: series.caption_style || "fade"
                },
                codec: "h264",
                imageFormat: "jpeg",
                maxRetries: 0,
                privacy: "public",
                // Optimized for an AWS account with a concurrency limit of 1000.
                // framesPerLambda: 30 means 1 second of video per Lambda worker.
                // This splits the video across many Lambdas (e.g. 60 Lambdas for a 60s video).
                // concurrencyPerLambda MUST be <= the number of CPU cores allocated to the Lambda.
                // The current Lambda size (mem2048mb) provides roughly 2 CPU cores.
                framesPerLambda: 30, 
                concurrencyPerLambda: 2,
            });

            // Poll for progress
            let progress;
            while (true) {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                progress = await getRenderProgress({
                    renderId,
                    bucketName,
                    functionName,
                    region,
                });
                
                if (progress.done) {
                    break;
                }
                if (progress.fatalErrorEncountered) {
                    const errMessage = progress.errors.length > 0 ? progress.errors[0]?.message : "Unknown error rendering video";
                    throw new Error(`Remotion Lambda error: ${errMessage}`);
                }
            }

            const videoUrl = progress.outputFile as string;
            
            // Incremental save
            if (event.data.videoId && videoUrl) {
                 const supabase = createAdminClient();
                 await supabase.from("video_generations").update({
                     final_video_url: videoUrl
                 }).eq("id", event.data.videoId);
            }

            return videoUrl;

        } catch (error) {
            console.error("Failed to render video on Lambda", error);
            throw error;
        }
    });

    // 7. Save everything to database (Finalize)
    const savedData = await step.run("save-generated-video", async () => {
        const supabase = createAdminClient();
        const { videoId } = event.data;

        let videoRecord;

        if (videoId) {
            // Finalize the row to completed
            const { data, error } = await supabase.from("video_generations").update({
                status: 'completed',
                final_video_url: videoResult || undefined
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
                status: 'completed',
                final_video_url: videoResult || undefined
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

    // 8. Send Email notification
    await step.run("send-email-notification", async () => {
        try {
            if (!videoResult || !images || images.length === 0) return { sent: false, reason: "No video or images" };
            
            const { createClerkClient } = await import("@clerk/nextjs/server");
            const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
            const user = await clerkClient.users.getUser(series.user_id);
            const userEmail = user.emailAddresses[0]?.emailAddress;

            if (!userEmail) {
                console.log("No user email found for user_id", series.user_id);
                return { sent: false, reason: "No user email" };
            }

            const { render } = await import("@react-email/render");
            const { VideoGeneratedEmail } = await import("../../components/emails/VideoGeneratedEmail");
            const { Resend } = await import("resend");

            const resendToken = process.env.RESEND_API_KEY;
            if (!resendToken) {
                 console.log("RESEND_API_KEY is missing, skipping email notification");
                 return { sent: false, reason: "No Resend API key" };
            }
            const resend = new Resend(resendToken);

            const thumbnailUrl = images[0] || "https://via.placeholder.com/300";
            
            const html = await render(VideoGeneratedEmail({
                title: scriptResult.title,
                videoUrl: videoResult,
                thumbnailUrl: thumbnailUrl
            }));

            // If you don't have a verified domain, Resend only allows sending to the email 
            // address that registered the Resend account from "onboarding@resend.dev".
            const { data, error } = await resend.emails.send({
                from: "onboarding@resend.dev",
                to: userEmail,
                subject: `Your video "${scriptResult.title}" is ready!`,
                html: html,
            });

            if (error) {
                 console.error("Resend API returned error:", error);
                 return { sent: false, error: String(error) };
            }

            console.log("Sent Resend email to", userEmail);
            return { sent: true, to: userEmail, id: data?.id };
        } catch (err) {
            console.error("Failed to send email notification", err);
            // Don't throw here to avoid failing the whole background function 
            // if everything else succeeded and just the email failed.
            return { sent: false, error: String(err) };
        }
    });

    // 9. Auto-Publish to YouTube
    const youtubePublish = await step.run("publish-to-youtube", async () => {
        try {
            // Check if series is configured to publish to YouTube
            const platforms = series.platforms || [];
            const safePlatforms = platforms.map((p: string) => p.toLowerCase());
            
            if (!safePlatforms.includes("youtube")) {
                return { skipped: true, reason: "YouTube not selected in series platforms" };
            }

            if (!videoResult) {
                return { skipped: true, reason: "No video generated to publish" };
            }

            const supabase = createAdminClient();
            
            // Fetch YouTube credentials
            const { data: connection, error: connError } = await supabase
                .from("social_connections")
                .select("*")
                .eq("user_id", series.user_id)
                .eq("platform", "youtube")
                .single();

            if (connError || !connection || !connection.access_token) {
                console.log("No YouTube connection found for user", series.user_id);
                return { skipped: true, reason: "No YouTube connection or tokens found" };
            }

            // Fetch the video file into a Buffer
            const videoResponse = await fetch(videoResult);
            if (!videoResponse.ok) {
                throw new Error(`Failed to fetch final video for upload: ${videoResponse.statusText}`);
            }
            const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

            const { google } = await import("googleapis");
            const { Readable } = await import("stream");

            const oauth2Client = new google.auth.OAuth2(
                process.env.YOUTUBE_CLIENT_ID,
                process.env.YOUTUBE_CLIENT_SECRET,
                `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`
            );

            oauth2Client.setCredentials({
                access_token: connection.access_token,
                refresh_token: connection.refresh_token,
                expiry_date: connection.expires_at ? new Date(connection.expires_at).getTime() : undefined
            });

            // Explicitly verify or refresh the token before the large video upload request.
            try {
                const refreshed = await oauth2Client.getAccessToken();
                if (refreshed?.token && refreshed.token !== connection.access_token) {
                     console.log("YouTube token was refreshed for this session.");
                     // Best practice: save the new access_token/expiry back to `social_connections`
                     await supabase.from("social_connections").update({
                         access_token: refreshed.token,
                         // Note: We don't get the exact new expiry easily from getAccessToken, 
                         // but oauth2Client tracks it internally for this request
                         updated_at: new Date().toISOString()
                     }).eq("id", connection.id);
                }
            } catch (authErr) {
                console.error("Failed to verify/refresh YouTube access token:", authErr);
                return { skipped: true, reason: "YouTube authentication expired, invalid, or requires re-login." };
            }

            const youtube = google.youtube({
                version: "v3",
                auth: oauth2Client
            });

            // Convert buffer to readable stream for googleapis
            const readableVideo = new Readable();
            readableVideo._read = () => {}; // _read is required but you can noop it
            readableVideo.push(videoBuffer);
            readableVideo.push(null);       // EOF

            console.log("Starting YouTube upload...");

            const desc = `Generated by AI Video Generator\n\n${series.niche}\n${scriptResult.script.substring(0, 200)}...`;

            const res = await youtube.videos.insert({
                part: ["snippet", "status"],
                requestBody: {
                    snippet: {
                        title: scriptResult.title || "My AI Generated Short",
                        description: desc,
                        tags: ["ai", "shorts", series.niche.replace(/\s+/g, '')],
                        categoryId: "22", // People & Blogs
                    },
                    status: {
                        privacyStatus: "private", // Default to private for safety
                        selfDeclaredMadeForKids: false,
                    },
                },
                media: {
                    mimeType: "video/mp4",
                    body: readableVideo,
                },
            });

            console.log("YouTube upload complete. Video ID:", res.data.id);
            return { published: true, objectId: res.data.id, platform: "youtube", url: `https://youtube.com/shorts/${res.data.id}` };

        } catch (error) {
            console.error("Failed to publish to YouTube", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            return { failed: true, error: errorMessage };
        }
    });

    return { 
        success: true, 
        seriesId,
        message: "Video generation workflow completed successfully.",
        data: { series, script: scriptResult, audio, captions: captionsResult, images, videoUrl: videoResult, savedData, youtubePublish }
    };
  }
);
