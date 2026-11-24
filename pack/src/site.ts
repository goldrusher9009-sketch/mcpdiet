export const PHONE_DISPLAY = "929-888-2848";
export const PHONE_TEL = "+19298882848";
const URL_BASE = "https://mcpseal.dev";
const TITLE = "MCP SEAL: Safety check for MCP servers before you install them";
const DESC = "MCP SEAL grades any MCP server A to F for supply-chain risk: install scripts, credential access, dynamic code, shell use and hidden network calls. Free CLI, live 3D demo and one-click connect for Claude, ChatGPT, Grok and Perplexity.";

export const robots = `User-agent: *\nAllow: /\nSitemap: ${URL_BASE}/sitemap.xml\n`;
export const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${URL_BASE}/</loc></url></urlset>`;

const ld = JSON.stringify({
  "@context": "https://schema.org", "@type": "SoftwareApplication", name: "MCP SEAL", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", description: DESC, url: URL_BASE, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${TITLE}</title><meta name="description" content="${DESC}"><link rel="canonical" href="${URL_BASE}/">
<meta property="og:title" content="${TITLE}"><meta property="og:description" content="${DESC}"><meta property="og:type" content="website"><meta property="og:url" content="${URL_BASE}/">
<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script>
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
#c3{width:100%;height:340px;border-radius:14px;background:radial-gradient(circle at 50% 40%,#16254d,#070b18);display:block;cursor:pointer;margin-top:1rem}
.hint{color:var(--mut);font-size:.85rem;margin:.3rem 0}.cg{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.8rem}
.cc{border:1px solid var(--line);border-radius:12px;padding:1rem;display:flex;flex-direction:column;gap:.5rem}.cc b{font-size:1.1rem}.cc small{color:var(--mut)}
.cc button{margin:0;padding:.6rem}.out{white-space:pre-wrap;background:#0f172a;color:#e2e8f0;border-radius:10px;padding:1rem;min-height:5rem;font:14px/1.5 ui-monospace,monospace}
select{padding:.6rem;border-radius:8px;border:1px solid #cbd5e1;font:inherit}.row{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.row input{flex:1;min-width:12rem}.row button{margin:0}
</style></head><body><main>
<header><span>MCP SEAL</span><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></header>
<h1>Know what an MCP server does before you install it.</h1>
<p class="sub">MCP servers run code on your machine with your credentials. MCP SEAL reads a package first and gives it a grade from A to F.</p>
<canvas id="c3" aria-label="3D MCP SEAL with orbiting tools"></canvas><p class="hint">Drag to spin. Click a glowing tool to try it live.</p>
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
<h2>Live demo</h2>
<p>This runs the real hosted tools right now. No install.</p>
<div class="row"><select id="tool"><option value="mcpseal_check">mcpseal_check: grade an npm package</option><option value="margin_calc">margin_calc: price from cost and margin</option><option value="cron_explain">cron_explain: explain a cron schedule</option><option value="prompt_lint">prompt_lint: lint an AI prompt</option><option value="meeting_times">meeting_times: overlap across time zones</option></select></div>
<div class="row" style="margin-top:.6rem"><input id="arg" value="@hashshabbir/mcpdiet" aria-label="Input"><button id="run" type="button">Run</button></div>
<pre class="out" id="out">Result appears here.</pre>
<h2>Connect in one click</h2>
<p>Copy the server address, then paste it where each app asks for a remote MCP server or custom connector. No code.</p>
<div class="cg">
<div class="cc"><b>Claude</b><small>Settings, Connectors, Add custom connector</small><button type="button" data-u="https://claude.ai/settings/connectors">Copy URL and open Claude</button></div>
<div class="cc"><b>ChatGPT</b><small>Settings, Connectors, developer mode, add MCP server</small><button type="button" data-u="https://chatgpt.com/">Copy URL and open ChatGPT</button></div>
<div class="cc"><b>Grok</b><small>Remote MCP works through the xAI API</small><button type="button" data-u="https://console.x.ai/">Copy URL and open xAI</button></div>
<div class="cc"><b>Perplexity</b><small>Settings, Connectors, add a remote MCP server</small><button type="button" data-u="https://www.perplexity.ai/">Copy URL and open Perplexity</button></div>
</div><p id="cs" class="hint" role="status"></p>
<p class="hint">Not yet listed in any official app directory. Submissions are in progress. Connector menus differ by plan and may need developer mode.</p>
<h2>Contact</h2>
<p>Questions, a package you want graded, or a team plan: write here or call <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>.</p>
<form id="f" method="post" action="/contact">
<label for="n">Name</label><input id="n" name="name" required maxlength="100">
<label for="e">Your email</label><input id="e" name="email" type="email" required maxlength="150">
<label for="m">Message</label><textarea id="m" name="message" rows="5" required maxlength="3000"></textarea>
<input class="hp" name="website" tabindex="-1" autocomplete="off"><button type="submit">Send</button><p id="s" role="status"></p></form>
<script>
const MCP=location.origin+"/mcp",$=id=>document.getElementById(id);
const ex={mcpseal_check:["@hashshabbir/mcpdiet",v=>({package:v})],margin_calc:["100",v=>({cost:+v,margin_pct:30})],cron_explain:["*/15 9-17 * * 1-5",v=>({expression:v})],prompt_lint:["Write something good about stuff",v=>({prompt:v})],meeting_times:["America/New_York,Europe/London",v=>({zones:v.split(",").map(x=>x.trim())})]};
async function call(name,args){const r=await fetch("/mcp",{method:"POST",headers:{"content-type":"application/json",accept:"application/json, text/event-stream"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/call",params:{name,arguments:args}})});if(r.status==429)return"Rate limit reached. Try again later.";const t=await r.text();const m=t.match(/data: (.*)/);const j=JSON.parse(m?m[1]:t);return j.result?j.result.content[0].text:JSON.stringify(j.error||j)}
function pick(n){$("tool").value=n;$("arg").value=ex[n][0];$("out").scrollIntoView({behavior:"smooth",block:"center"})}
$("tool").onchange=()=>{$("arg").value=ex[$("tool").value][0]};
$("run").onclick=async()=>{const n=$("tool").value;$("out").textContent="Running...";try{$("out").textContent=await call(n,ex[n][1]($("arg").value))}catch(e){$("out").textContent="Could not run: "+e.message}};
document.querySelectorAll(".cc button").forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(MCP);$("cs").textContent="Copied "+MCP+". Paste it into the app."}catch{$("cs").textContent="Copy this address: "+MCP}window.open(b.dataset.u,"_blank","noopener")});
</script>
<script type="module">
import*as T from"three";
const cv=document.getElementById("c3"),R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true}),S=new T.Scene(),C=new T.PerspectiveCamera(50,2,.1,100);C.position.set(0,0,7);
S.add(new T.AmbientLight(0xffffff,.6));const L=new T.PointLight(0x6aa0ff,60,30);L.position.set(5,5,6);S.add(L);
const g=new T.Group();S.add(g);
g.add(new T.Mesh(new T.IcosahedronGeometry(1.5,1),new T.MeshStandardMaterial({color:0x0b5fff,metalness:.5,roughness:.25,flatShading:true})));
g.add(new T.Mesh(new T.IcosahedronGeometry(1.9,1),new T.MeshBasicMaterial({color:0x7aa8ff,wireframe:true,transparent:true,opacity:.35})));
const names=["mcpseal_check","margin_calc","cron_explain","prompt_lint","meeting_times"],nodes=[];
names.forEach((n,i)=>{const m=new T.Mesh(new T.SphereGeometry(.28,24,24),new T.MeshStandardMaterial({color:0x34d399,emissive:0x0f9d6e,emissiveIntensity:.8}));m.userData={n,a:i/names.length*Math.PI*2};g.add(m);nodes.push(m);
const c=document.createElement("canvas");c.width=256;c.height=64;const x=c.getContext("2d");x.fillStyle="#fff";x.font="bold 28px sans-serif";x.textAlign="center";x.fillText(n,128,40);
const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true}));sp.scale.set(2,.5,1);sp.position.y=.55;m.add(sp)});
let drag=false,lx=0,ry=0,rx=.3,moved=0;
cv.onpointerdown=e=>{drag=true;lx=e.clientX;moved=0;cv.setPointerCapture(e.pointerId)};cv.onpointerup=()=>drag=false;
cv.onpointermove=e=>{if(drag){ry+=(e.clientX-lx)*.01;moved+=Math.abs(e.clientX-lx);lx=e.clientX}};
cv.onclick=e=>{if(moved>6)return;const b=cv.getBoundingClientRect(),v=new T.Vector2((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height)*2+1),rc=new T.Raycaster();rc.setFromCamera(v,C);const h=rc.intersectObjects(nodes)[0];if(h)pick(h.object.userData.n)};
function size(){const w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}
let t=0;(function loop(){requestAnimationFrame(loop);t+=.01;if(!drag)ry+=.004;g.rotation.y=ry;g.rotation.x=rx;
nodes.forEach(m=>{const a=m.userData.a+t;m.position.set(Math.cos(a)*3,Math.sin(a*1.3)*.8,Math.sin(a)*3)});size();R.render(S,C)})();
</script>
<script>f.onsubmit=async e=>{e.preventDefault();s.textContent="Sending...";try{const r=await fetch("/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(f)))});s.textContent=r.ok?"Thanks. We will reply soon.":"Could not send. Please call ${PHONE_DISPLAY}.";if(r.ok)f.reset()}catch{s.textContent="Could not send. Please call ${PHONE_DISPLAY}."}}</script>
<footer>MCP SEAL &middot; <a href="https://www.npmjs.com/package/@hashshabbir/mcp-pack">npm package</a> &middot; <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></footer>
</main></body></html>`;
