export const PHONE_DISPLAY = "929-888-2848";
export const PHONE_TEL = "+19298882848";
const URL_BASE = "https://mcpseal.dev";
const TITLE = "MCP SEAL: Safety check for MCP servers before you install them";
const DESC = "MCP SEAL grades any MCP server A to F for supply-chain risk: install scripts, credential access, dynamic code, shell use and hidden network calls. Free CLI and hosted MCP endpoint.";

export const robots = `User-agent: *\nAllow: /\nSitemap: ${URL_BASE}/sitemap.xml\n`;
export const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${URL_BASE}/</loc></url></urlset>`;

const ld = JSON.stringify({
  "@context": "https://schema.org", "@type": "SoftwareApplication", name: "MCP SEAL", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", description: DESC, url: URL_BASE, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${TITLE}</title><meta name="description" content="${DESC}"><link rel="canonical" href="${URL_BASE}/">
<meta property="og:title" content="${TITLE}"><meta property="og:description" content="${DESC}"><meta property="og:type" content="website"><meta property="og:url" content="${URL_BASE}/">
<script type="application/ld+json">${ld}</script>
<style>
:root{--ink:#0f172a;--mut:#475569;--line:#e2e8f0;--acc:#0b5fff;--bg:#fff}
*{box-sizing:border-box}body{margin:0;font:17px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg)}
main{max-width:46rem;margin:0 auto;padding:0 1.25rem 4rem}header{padding:1.2rem 0;display:flex;justify-content:space-between;align-items:center;font-weight:700}
a{color:var(--acc)}h1{font-size:2.3rem;line-height:1.15;margin:2.5rem 0 .8rem}h2{margin:2.6rem 0 .6rem}
.sub{color:var(--mut);font-size:1.15rem}code,pre{background:#0f172a;color:#e2e8f0;border-radius:8px}code{padding:.1rem .35rem;font-size:.92em}
pre{padding:1rem;overflow:auto;font-size:.92rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:.7rem}
.card{border:1px solid var(--line);border-radius:10px;padding:.8rem 1rem}.g{font-weight:800;font-size:1.4rem}
label{display:block;margin:.8rem 0 .2rem;font-weight:600}input,textarea{width:100%;padding:.65rem;border:1px solid #cbd5e1;border-radius:8px;font:inherit}
button{margin-top:1rem;background:var(--acc);color:#fff;border:0;border-radius:8px;padding:.75rem 1.4rem;font:inherit;font-weight:700;cursor:pointer}
.hp{position:absolute;left:-9999px}footer{color:var(--mut);font-size:.9rem;margin-top:3rem;border-top:1px solid var(--line);padding-top:1rem}
</style></head><body><main>
<header><span>MCP SEAL</span><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></header>
<h1>Know what an MCP server does before you install it.</h1>
<p class="sub">MCP servers run code on your machine with your credentials. MCP SEAL reads a package first and gives it a grade from A to F.</p>
<h2>Try it in one line</h2>
<pre>npx -p @hashshabbir/mcp-pack mcpseal @scope/some-mcp-server</pre>
<p>No sign-up and no API key. It downloads the package without running it and checks the code.</p>
<h2>What it checks</h2>
<div class="grid"><div class="card">Install scripts that run on <code>npm install</code></div><div class="card">Reads of keys, tokens and env files</div><div class="card">Dynamic code such as <code>eval</code></div><div class="card">Shell and process spawning</div><div class="card">Hidden network calls</div><div class="card">Package age and maintainers</div></div>
<h2>Grades</h2>
<div class="grid"><div class="card"><span class="g">A</span> 90+<br>Clean</div><div class="card"><span class="g">B</span> 80+<br>Minor notes</div><div class="card"><span class="g">C</span> 65+<br>Review first</div><div class="card"><span class="g">D / F</span><br>Do not install blind</div></div>
<p>MCP SEAL is a static heuristic. It can flag safe code and it cannot prove a package is safe. Treat C or lower as a prompt to read the code.</p>
<h2>Use it from Claude, ChatGPT and other AI clients</h2>
<p>Add this remote MCP server URL as a custom connector. No login.</p>
<pre>${URL_BASE}/mcp</pre>
<p>Tools: <code>mcpseal_check</code>, <code>margin_calc</code>, <code>meeting_times</code>, <code>cron_explain</code>, <code>prompt_lint</code>.</p>
<h2>Contact</h2>
<p>Questions, a package you want graded, or a team plan: write here or call <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>.</p>
<form id="f" method="post" action="/contact">
<label for="n">Name</label><input id="n" name="name" required maxlength="100">
<label for="e">Your email</label><input id="e" name="email" type="email" required maxlength="150">
<label for="m">Message</label><textarea id="m" name="message" rows="5" required maxlength="3000"></textarea>
<input class="hp" name="website" tabindex="-1" autocomplete="off"><button type="submit">Send</button><p id="s" role="status"></p></form>
<script>f.onsubmit=async e=>{e.preventDefault();s.textContent="Sending...";try{const r=await fetch("/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(f)))});s.textContent=r.ok?"Thanks. We will reply soon.":"Could not send. Please call ${PHONE_DISPLAY}.";if(r.ok)f.reset()}catch{s.textContent="Could not send. Please call ${PHONE_DISPLAY}."}}</script>
<footer>MCP SEAL &middot; <a href="https://www.npmjs.com/package/@hashshabbir/mcp-pack">npm package</a> &middot; <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></footer>
</main></body></html>`;
