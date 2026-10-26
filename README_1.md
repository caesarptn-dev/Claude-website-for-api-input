# Claude Chat

A single-file, streaming chat website for Claude. No build step, no backend required.

## Publish on GitHub Pages
1. Create a repo and add `index.html` (and this README).
2. **Settings → Pages → Deploy from branch → `main` / root.**
3. Open `https://<your-username>.github.io/<repo>/`.

## ⚠️ About your API key
**Never commit your API key to GitHub.** Anything in a public repo or static page can be read and abused by anyone, and leaked keys get scraped within minutes.

Two safe ways to use this site:

### Option A: Bring your own key (default, simplest)
Open **Settings** in the page and paste your key. It is saved only in your browser's localStorage and sent directly to `api.anthropic.com`. Good for personal use. Anyone else who visits needs their own key.

### Option B: Proxy (for sharing with others on your own key)
Deploy `worker.js` as a Cloudflare Worker (free tier is fine):

```bash
npm i -g wrangler
wrangler deploy worker.js --name claude-proxy --compatibility-date 2025-01-01
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put ALLOWED_ORIGIN   # https://<your-username>.github.io
```

Then paste the Worker URL into **Settings → Proxy URL**. The key stays on the server. Note that anyone who can load your site can spend your credits, so set a spend limit in the Anthropic Console and consider adding rate limiting or a login.

## Features
Streaming responses, Markdown and code rendering, stop button, model picker, system prompt, dark mode.
