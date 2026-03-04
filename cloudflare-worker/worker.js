export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed. Use POST.", { status: 405 });
    }

    // Authenticate
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.API_KEY}`) {
      return new Response("Unauthorized.", { status: 401 });
    }

    try {
      const { prompt } = await request.json();
      if (!prompt) {
        return new Response("Missing prompt in request body.", { status: 400 });
      }

      // Generate the image using Cloudflare Workers AI
      // Model options: @cf/stabilityai/stable-diffusion-xl-base-1.0
      //                @cf/runwayml/stable-diffusion-v1-5
      //                @cf/bytedance/stable-diffusion-xl-lightning
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt },
      );

      // Return the image blob
      return new Response(response, {
        headers: {
          "Content-Type": "image/png",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (e) {
      return new Response(`Error generating image: ${e.message}`, {
        status: 500,
      });
    }
  },
};
