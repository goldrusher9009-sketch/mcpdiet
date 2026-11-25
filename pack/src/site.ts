export const PHONE_DISPLAY = "929-888-2848";
export const PHONE_TEL = "+19298882848";
const URL_BASE = "https://mcpseal.dev";
const TITLE = "MCP SEAL: Safety check for MCP servers before you install them";
const DESC = "MCP SEAL grades any MCP server A to F for supply-chain risk: install scripts, credential access, dynamic code, shell use and hidden network calls. Free CLI, live demo and one-click connect for Claude, ChatGPT, Grok and Perplexity.";

export const robots = `User-agent: *\nAllow: /\nSitemap: ${URL_BASE}/sitemap.xml\n`;
export const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${URL_BASE}/</loc></url><url><loc>${URL_BASE}/docs</loc></url><url><loc>${URL_BASE}/privacy</loc></url></urlset>`;

const ld = JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "MCP SEAL", applicationCategory: "DeveloperApplication", operatingSystem: "Any", description: DESC, url: URL_BASE, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } });

export const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${TITLE}</title><meta name="description" content="${DESC}"><link rel="canonical" href="${URL_BASE}/"><meta name="theme-color" content="#0f0b0a">
<meta property="og:title" content="${TITLE}"><meta property="og:description" content="${DESC}"><meta property="og:type" content="website"><meta property="og:url" content="${URL_BASE}/">
<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script>
<script type="application/ld+json">${ld}</script>
<style>
:root{--bg:#0f0b0a;--panel:rgba(255,240,230,.045);--line:rgba(255,220,200,.12);--tx:#f6ece6;--mut:#a8968d;--a:#ff7a4d;--b:#e0413a;--ok:#34d399}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--tx);font:17px/1.65 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;overflow-x:hidden}
a{color:var(--a);text-decoration:none}.w{max-width:1120px;margin:0 auto;padding:0 1.5rem}
nav{position:fixed;top:0;left:0;right:0;z-index:20;backdrop-filter:blur(14px);background:rgba(15,11,10,.65);border-bottom:1px solid var(--line)}
nav .w{display:flex;align-items:center;justify-content:space-between;height:62px}.logo{font-weight:800;letter-spacing:.08em;color:#fff}.logo i{font-style:normal;background:linear-gradient(90deg,var(--a),var(--b));-webkit-background-clip:text;color:transparent}
nav .l{display:flex;gap:1.6rem;align-items:center;font-size:.95rem}nav .l a{color:var(--mut)}nav .l a:hover{color:#fff}
.btn{display:inline-block;background:linear-gradient(90deg,var(--a),var(--b));color:#fff!important;border:0;border-radius:10px;padding:.8rem 1.5rem;font:inherit;font-weight:700;cursor:pointer;box-shadow:0 8px 30px rgba(255,122,77,.35);transition:transform .15s}
.btn:hover{transform:translateY(-2px)}.btn.ghost{background:transparent;border:1px solid var(--line);box-shadow:none;color:var(--tx)!important}
.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
#c3{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab}
.hero .w{position:relative;z-index:2;pointer-events:none;padding-top:5rem}.hero .w>*{pointer-events:auto}
.tag{display:inline-block;border:1px solid var(--line);background:var(--panel);border-radius:99px;padding:.3rem .9rem;font-size:.85rem;color:var(--mut);margin-bottom:1.2rem}
h1{font-size:clamp(2.4rem,6vw,4.6rem);line-height:1.04;margin:0 0 1.2rem;letter-spacing:-.03em;max-width:13ch}
h1 em{font-style:normal;background:linear-gradient(90deg,var(--a),var(--b));-webkit-background-clip:text;color:transparent}
.lead{font-size:1.2rem;color:var(--mut);max-width:34rem;margin:0 0 2rem}.cta{display:flex;gap:.8rem;flex-wrap:wrap}
.hint{position:absolute;bottom:1.4rem;left:0;right:0;text-align:center;color:var(--mut);font-size:.85rem;z-index:2;pointer-events:none}
section{padding:6rem 0}h2{font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.02em;margin:0 0 .6rem}.sub{color:var(--mut);margin:0 0 2.4rem;max-width:40rem}
.g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:1rem}.g4{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:1rem}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:1.4rem;transition:border-color .2s,transform .2s}.card:hover{border-color:rgba(255,122,77,.5);transform:translateY(-3px)}
.card h3{margin:.2rem 0 .4rem;font-size:1.1rem}.card p{margin:0;color:var(--mut);font-size:.95rem}.n{font-size:.8rem;color:var(--a);font-weight:800;letter-spacing:.12em}
.grades{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1rem}.gr{flex:1;min-width:8rem;border-radius:14px;padding:1rem 1.2rem;border:1px solid var(--line);background:var(--panel)}.gr b{font-size:2.2rem;line-height:1;display:block}
.A b{color:#34d399}.B b{color:#a3e635}.C b{color:#fbbf24}.D b{color:#fb923c}.F b{color:#f87171}.gr span{color:var(--mut);font-size:.85rem}
.term{background:#17100e;border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.bar{display:flex;gap:.45rem;padding:.8rem 1rem;border-bottom:1px solid var(--line)}.bar i{width:11px;height:11px;border-radius:50%;background:#3a2a24}
.ctl{display:flex;gap:.6rem;padding:1rem;flex-wrap:wrap;border-bottom:1px solid var(--line)}
select,input,textarea{background:#1d1512;color:var(--tx);border:1px solid var(--line);border-radius:10px;padding:.7rem .9rem;font:inherit;width:100%}select{width:auto;min-width:14rem}.ctl input{flex:1;min-width:12rem;width:auto}
.out{margin:0;padding:1.2rem;min-height:9rem;white-space:pre-wrap;font:14px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:#f1d3c6}
.cc{display:flex;flex-direction:column;gap:.7rem}.cc .ic{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:1.2rem;color:#fff}
.cc small{color:var(--mut);flex:1}.cc .btn{padding:.65rem 1rem;font-size:.92rem;text-align:center}
code{background:#1d1512;border:1px solid var(--line);padding:.1rem .45rem;border-radius:6px;font-size:.88em;color:#ffd2c2}
.url{display:flex;align-items:center;gap:.8rem;background:#17100e;border:1px solid var(--line);border-radius:12px;padding:.9rem 1.1rem;font-family:ui-monospace,monospace;margin-bottom:1.5rem;flex-wrap:wrap}
.two{display:grid;grid-template-columns:1fr 1fr;gap:2rem}@media(max-width:800px){.two{grid-template-columns:1fr}nav .l a.h{display:none}}
label{display:block;margin:1rem 0 .3rem;font-weight:600;font-size:.9rem;color:var(--mut)}.hp{position:absolute;left:-9999px}
.ph{font-size:2rem;font-weight:800;color:#fff;display:block;margin:.4rem 0 1.2rem}
footer{border-top:1px solid var(--line);padding:2rem 0;color:var(--mut);font-size:.9rem}footer .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.fine{color:var(--mut);font-size:.85rem;margin-top:1rem}
.hero:before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,var(--bg) 0%,rgba(15,11,10,.82) 38%,rgba(15,11,10,0) 70%)}
body{background:radial-gradient(1200px 700px at 85% -10%,rgba(224,65,58,.16),transparent 60%),radial-gradient(900px 600px at -10% 40%,rgba(255,122,77,.08),transparent 60%),var(--bg)}
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}.rv.in{opacity:1;transform:none}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:1rem;padding:2.2rem 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.stats b{display:block;font-size:2.1rem;line-height:1.1;background:linear-gradient(90deg,var(--a),var(--b));-webkit-background-clip:text;color:transparent}.stats span{color:var(--mut);font-size:.9rem}
.mq{overflow:hidden;border-bottom:1px solid var(--line);padding:1rem 0;white-space:nowrap;color:var(--mut);font-size:.95rem;letter-spacing:.14em;text-transform:uppercase}
.mq div{display:inline-block;animation:mq 28s linear infinite}.mq span{margin:0 2rem}.mq span:nth-child(odd){color:var(--a)}@keyframes mq{to{transform:translateX(-50%)}}
.btn{background-size:200% 100%;animation:sh 6s ease infinite}@keyframes sh{50%{background-position:100% 0}}
.card:hover{box-shadow:0 20px 60px rgba(224,65,58,.18)}
@media(prefers-reduced-motion:reduce){.mq div,.btn{animation:none}.rv{opacity:1;transform:none}}
</style></head><body>
<nav><div class="w"><a class="logo" href="#top">MCP<i>SEAL</i></a><div class="l"><a class="h" href="#how">How it works</a><a class="h" href="#demo">Live demo</a><a class="h" href="#connect">Connect</a><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a><a class="btn" href="#demo">Try it free</a></div></div></nav>
<div class="hero" id="top"><canvas id="c3" aria-label="3D MCP SEAL with orbiting tools"></canvas>
<div class="w"><span class="tag">Free. No sign-up. No API key.</span>
<h1>Know what an MCP server does <em>before</em> you install it.</h1>
<p class="lead">MCP servers run code on your machine with your credentials. MCP SEAL reads the package first and grades it A to F in seconds.</p>
<div class="cta"><a class="btn" href="#demo">Grade a package</a><a class="btn ghost" href="#connect">Add to Claude, ChatGPT, Grok</a></div></div>
<div class="hint">Drag the seal to spin it. Click a glowing tool to try it live.</div></div>

<div class="mq" aria-hidden="true"><div><span>Claude</span><span>/</span><span>ChatGPT</span><span>/</span><span>Grok</span><span>/</span><span>Perplexity</span><span>/</span><span>Any MCP client</span><span>/</span><span>Claude</span><span>/</span><span>ChatGPT</span><span>/</span><span>Grok</span><span>/</span><span>Perplexity</span><span>/</span><span>Any MCP client</span><span>/</span></div></div><section style="padding:0 0 1rem"><div class="w"><div class="stats rv"><div><b>A to F</b><span>one clear grade</span></div><div><b>0</b><span>API keys or sign-ups</span></div><div><b>5</b><span>live hosted tools</span></div><div><b>27</b><span>tools in the CLI pack</span></div></div></div></section>
<section id="how"><div class="w"><h2>Three steps. Zero setup.</h2><p class="sub">Run it from a terminal or from inside your AI app. Same answer either way.</p>
<div class="g3"><div class="card"><span class="n">01</span><h3>Point it at a package</h3><p>Any public npm package name, such as <code>@scope/server</code>.</p></div>
<div class="card"><span class="n">02</span><h3>We read it, never run it</h3><p>Install scripts, credential reads, <code>eval</code>, shell calls, hidden network traffic, package age.</p></div>
<div class="card"><span class="n">03</span><h3>Get a grade and reasons</h3><p>A clear A to F with each finding ranked, so you know what to read.</p></div></div>
<div class="grades"><div class="gr A"><b>A</b><span>90+ clean</span></div><div class="gr B"><b>B</b><span>80+ minor notes</span></div><div class="gr C"><b>C</b><span>65+ review first</span></div><div class="gr D"><b>D</b><span>50+ risky</span></div><div class="gr F"><b>F</b><span>do not install blind</span></div></div>
<p class="fine">A static heuristic. It can flag safe code and it cannot prove a package is safe. Treat C or lower as a cue to read the code.</p>
<p style="margin-top:1.5rem">Terminal: <code>npx -p @hashshabbir/mcp-pack mcpseal @scope/some-mcp-server</code></p></div></section>

<section id="demo" style="background:linear-gradient(180deg,transparent,rgba(255,122,77,.06),transparent)"><div class="w"><h2>Live demo</h2><p class="sub">This calls the real hosted tools right now. Nothing to install.</p>
<div class="term"><div class="bar"><i></i><i></i><i></i></div>
<div class="ctl"><select id="tool"><option value="mcpseal_check">mcpseal_check: grade an npm package</option><option value="margin_calc">margin_calc: price from cost and margin</option><option value="cron_explain">cron_explain: explain a cron schedule</option><option value="prompt_lint">prompt_lint: lint an AI prompt</option><option value="meeting_times">meeting_times: overlap across time zones</option></select>
<input id="arg" value="@hashshabbir/mcpdiet" aria-label="Input"><button class="btn" id="run" type="button">Run</button></div>
<pre class="out" id="out">Press Run to see a result.</pre></div></div></section>

<section id="connect"><div class="w"><h2>Connect in one click</h2><p class="sub">Copy the server address, then paste it where each app asks for a remote MCP server or custom connector. No code.</p>
<div class="url"><span id="u">https://mcpseal.dev/mcp</span><button class="btn" id="cp" type="button" style="margin-left:auto;padding:.5rem 1.1rem">Copy</button></div>
<div class="g4">
<div class="card cc"><div class="ic" style="background:#d97757">C</div><h3>Claude</h3><small>Settings, Connectors, Add custom connector</small><button class="btn" type="button" data-u="https://claude.ai/settings/connectors">Copy URL and open</button></div>
<div class="card cc"><div class="ic" style="background:#10a37f">G</div><h3>ChatGPT</h3><small>Settings, Connectors, developer mode, add MCP server</small><button class="btn" type="button" data-u="https://chatgpt.com/">Copy URL and open</button></div>
<div class="card cc"><div class="ic" style="background:#222">X</div><h3>Grok</h3><small>Remote MCP works through the xAI API</small><button class="btn" type="button" data-u="https://console.x.ai/">Copy URL and open</button></div>
<div class="card cc"><div class="ic" style="background:#20808d">P</div><h3>Perplexity</h3><small>Settings, Connectors, add a remote MCP server</small><button class="btn" type="button" data-u="https://www.perplexity.ai/">Copy URL and open</button></div>
</div><p id="cs" class="fine" role="status">Tools: <code>mcpseal_check</code> <code>margin_calc</code> <code>meeting_times</code> <code>cron_explain</code> <code>prompt_lint</code>. Not yet listed in any official app directory; submissions are in progress. Menus differ by plan.</p></div></section>

<section id="contact"><div class="w two"><div><h2>Talk to us</h2><p class="sub">Want a package graded, a team plan, or a custom check? Call or write.</p><a class="ph" href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a><p class="fine">We reply to every message.</p></div>
<form id="f" method="post" action="/contact"><label for="n">Name</label><input id="n" name="name" required maxlength="100"><label for="e">Your email</label><input id="e" name="email" type="email" required maxlength="150"><label for="m">Message</label><textarea id="m" name="message" rows="4" required maxlength="3000"></textarea>
<input class="hp" name="website" tabindex="-1" autocomplete="off"><button class="btn" type="submit" style="margin-top:1.2rem">Send message</button><p id="s" role="status" class="fine"></p></form></div></section>
<footer><div class="w"><span>MCP SEAL</span><span><a href="https://www.npmjs.com/package/@hashshabbir/mcp-pack">npm package</a> &middot; <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></span></div></footer>

<script>
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".card,.gr,section h2,.sub,.term,.url,.ph").forEach(x=>{x.classList.add("rv");io.observe(x)});document.querySelectorAll(".stats").forEach(x=>io.observe(x));
const MCP=location.origin+"/mcp",$=id=>document.getElementById(id);
const ex={mcpseal_check:["@hashshabbir/mcpdiet",v=>({package:v})],margin_calc:["100",v=>({cost:+v,margin_pct:30})],cron_explain:["*/15 9-17 * * 1-5",v=>({expression:v})],prompt_lint:["Write something good about stuff",v=>({prompt:v})],meeting_times:["America/New_York,Europe/London",v=>({zones:v.split(",").map(x=>x.trim())})]};
async function call(name,args){const r=await fetch("/mcp",{method:"POST",headers:{"content-type":"application/json",accept:"application/json, text/event-stream"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/call",params:{name,arguments:args}})});if(r.status==429)return"Rate limit reached. Try again later.";const t=await r.text();const m=t.match(/data: (.*)/);const j=JSON.parse(m?m[1]:t);return j.result?j.result.content[0].text:JSON.stringify(j.error||j)}
window.pick=n=>{$("tool").value=n;$("arg").value=ex[n][0];location.hash="demo";setTimeout(()=>$("run").click(),400)};
$("tool").onchange=()=>{$("arg").value=ex[$("tool").value][0]};
$("run").onclick=async()=>{const n=$("tool").value;$("out").textContent="Running...";try{$("out").textContent=await call(n,ex[n][1]($("arg").value))}catch(e){$("out").textContent="Could not run: "+e.message}};
const copy=async()=>{try{await navigator.clipboard.writeText(MCP);$("cs").textContent="Copied "+MCP+". Paste it into the app."}catch{$("cs").textContent="Copy this address: "+MCP}};
$("u").textContent=MCP;$("cp").onclick=copy;
document.querySelectorAll("[data-u]").forEach(b=>b.onclick=async()=>{await copy();window.open(b.dataset.u,"_blank","noopener")});
</script>
<script type="module">
import*as T from"three";
const cv=document.getElementById("c3"),R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new T.Scene(),C=new T.PerspectiveCamera(50,2,.1,100);C.position.set(0,0,10.5);
S.add(new T.AmbientLight(0xffd0bd,.55));const L1=new T.PointLight(0xff7a4d,140,40);L1.position.set(6,5,6);S.add(L1);const L2=new T.PointLight(0xe0213a,110,40);L2.position.set(-6,-4,4);S.add(L2);
const g=new T.Group();S.add(g);
g.add(new T.Mesh(new T.TorusKnotGeometry(1.2,.4,160,24),new T.MeshStandardMaterial({color:0xe2553b,metalness:.9,roughness:.28})));
g.add(new T.Mesh(new T.IcosahedronGeometry(2.1,1),new T.MeshBasicMaterial({color:0xffa488,wireframe:true,transparent:true,opacity:.18})));
const pts=new Float32Array(1800);for(let i=0;i<1800;i++)pts[i]=(Math.random()-.5)*34;
const pg=new T.BufferGeometry();pg.setAttribute("position",new T.BufferAttribute(pts,3));S.add(new T.Points(pg,new T.PointsMaterial({color:0xe0a58c,size:.05,transparent:true,opacity:.7})));
const names=["mcpseal_check","margin_calc","cron_explain","prompt_lint","meeting_times"],nodes=[];
names.forEach((n,i)=>{const m=new T.Mesh(new T.SphereGeometry(.26,24,24),new T.MeshStandardMaterial({color:0xffd2b8,emissive:0xff6a45,emissiveIntensity:1.1}));m.userData={n,a:i/names.length*Math.PI*2};g.add(m);nodes.push(m);
const c=document.createElement("canvas");c.width=320;c.height=64;const x=c.getContext("2d");x.fillStyle="#f6ece6";x.font="600 30px ui-monospace,monospace";x.textAlign="center";x.fillText(n,160,42);
const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthTest:false}));sp.scale.set(2.2,.44,1);sp.position.y=.6;m.add(sp)});
let drag=false,lx=0,ry=0,moved=0,mx=0,my=0;
cv.onpointerdown=e=>{drag=true;lx=e.clientX;moved=0;cv.setPointerCapture(e.pointerId)};cv.onpointerup=()=>drag=false;
cv.onpointermove=e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;if(drag){ry+=(e.clientX-lx)*.01;moved+=Math.abs(e.clientX-lx);lx=e.clientX}};
cv.onclick=e=>{if(moved>6)return;const b=cv.getBoundingClientRect(),v=new T.Vector2((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height)*2+1),rc=new T.Raycaster();rc.setFromCamera(v,C);const h=rc.intersectObjects(nodes)[0];if(h)pick(h.object.userData.n)};
function size(){const w=cv.clientWidth,h=cv.clientHeight;if(cv.width!==w*R.getPixelRatio()||cv.height!==h*R.getPixelRatio()){R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}g.position.x=w>800?2.9:0;g.position.y=w>800?0:2.6;g.scale.setScalar(w>800?1:.75)}
let t=0;(function loop(){requestAnimationFrame(loop);t+=.012;if(!drag)ry+=.004;g.rotation.y=ry;g.rotation.x=.25+my*.4;g.rotation.z=mx*.2;
nodes.forEach(m=>{const a=m.userData.a+t*.7;m.position.set(Math.cos(a)*3.1,Math.sin(a*1.4)*.9,Math.sin(a)*3.1)});size();R.render(S,C)})();
</script>
<script>
f.onsubmit=async e=>{e.preventDefault();s.textContent="Sending...";try{const r=await fetch("/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(f)))});s.textContent=r.ok?"Thanks. We will reply soon.":"Could not send. Please call ${PHONE_DISPLAY}.";if(r.ok)f.reset()}catch{s.textContent="Could not send. Please call ${PHONE_DISPLAY}."}}
</script></body></html>`;

const shell = (title: string, body: string) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | MCP SEAL</title><link rel="canonical" href="${URL_BASE}">
<style>body{margin:0;background:#0f0b0a;color:#f6ece6;font:17px/1.7 system-ui,sans-serif}main{max-width:44rem;margin:0 auto;padding:3rem 1.5rem}a{color:#ff7a4d}h1{letter-spacing:-.02em}h2{margin-top:2rem}code,pre{background:#1d1512;border-radius:6px;padding:.1rem .4rem}pre{padding:1rem;overflow:auto}</style></head><body><main><p><a href="/">&larr; MCP SEAL</a></p>${body}</main></body></html>`;

export const privacy = shell("Privacy policy", `<h1>Privacy policy</h1><p>Last updated: November 24, 2026.</p>
<h2>What we collect</h2><p>MCP SEAL has no accounts and no sign-in. Tool inputs you send to the server (for example an npm package name, a cron expression or a prompt) are processed to produce a result and are not stored by us.</p>
<p>Messages sent through the contact form (name, email, message) are forwarded by email to us so we can reply. We do not sell or share them.</p>
<h2>Technical data</h2><p>Our hosting provider (Railway) may keep standard request logs, such as IP address and time. For rate limiting we hold IP addresses in server memory for up to one hour. We do not use advertising or tracking cookies.</p>
<h2>Third parties</h2><p>The package check downloads public package files from the npm registry. Contact form messages pass through an email relay service.</p>
<h2>Your choices</h2><p>To ask us to delete a message you sent, call 929-888-2848 or use the <a href="/#contact">contact form</a>.</p>`);

export const docs = shell("Documentation", `<h1>MCP SEAL documentation</h1>
<p>MCP SEAL is a remote MCP server with no sign-in. Server URL: <code>${URL_BASE}/mcp</code> (Streamable HTTP).</p>
<h2>Connect</h2><p>In your AI app, add a custom connector or remote MCP server and paste the URL above.</p>
<h2>Tools</h2><ul>
<li><b>mcpseal_check</b> <code>{package}</code>: grades a public npm package A to F for supply-chain risk. Static heuristic. Limit 20 checks per hour per IP.</li>
<li><b>margin_calc</b> <code>{cost, margin_pct | markup_pct}</code>: converts markup and margin and computes a price.</li>
<li><b>meeting_times</b> <code>{zones[], start, end, date}</code>: working-hour overlap across IANA time zones.</li>
<li><b>cron_explain</b> <code>{expression, count}</code>: next run times for a 5-field cron expression.</li>
<li><b>prompt_lint</b> <code>{prompt}</code>: flags vague wording and missing structure in a prompt.</li></ul>
<p>All tools are read-only. <code>mcpseal_check</code> contacts the public npm registry; the others do not use the network.</p>
<h2>Example</h2><pre>mcpseal_check {"package": "@hashshabbir/mcpdiet"}
Seal: A (90/100)</pre>
<h2>CLI</h2><p><code>npx -p @hashshabbir/mcp-pack mcpseal @scope/server</code></p>
<h2>Support</h2><p>Use the <a href="/#contact">contact form</a> or call 929-888-2848.</p>`);
