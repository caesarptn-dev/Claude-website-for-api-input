// Optional Cloudflare Worker that keeps your Anthropic API key secret.
// Deploy:  npm i -g wrangler && wrangler deploy worker.js --name claude-proxy --compatibility-date 2025-01-01
// Then:    wrangler secret put ANTHROPIC_API_KEY
//          wrangler secret put ALLOWED_ORIGIN     (e.g. https://yourname.github.io)

const ALLOWED_MODELS = [
  "claude-sonnet-5-5",
  "claude-opus-5-5",
  "claude-haiku-5-5",
  "claude-fable-5-1",
];
const MAX_TOKENS_CAP = 8192;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    if (origin !== env.ALLOWED_ORIGIN) return new Response("Forbidden origin", { status: 403, headers: cors });

    let body;
    try { body = await request.json(); } catch { return new Response("Bad JSON", { status: 400, headers: cors }); }

    if (!ALLOWED_MODELS.includes(body.model)) return new Response("Model not allowed", { status: 400, headers: cors });
    body.max_tokens = Math.min(Number(body.max_tokens) || 1024, MAX_TOKENS_CAP);

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, "content-type": upstream.headers.get("content-type") || "application/json" },
    });
  },
};
