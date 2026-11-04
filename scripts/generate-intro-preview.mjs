// Build the normal document and Replay review from one opening controller/markup.
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const shellPath=path.join(root,'index.html');
let shell=fs.readFileSync(shellPath,'utf8');
const runtime=fs.readFileSync(path.join(root,'scripts/brand-opening-scene.js'),'utf8').trim()+'\n'+fs.readFileSync(path.join(root,'scripts/brand-opening-controller.js'),'utf8').trim();
const controller=`<script id="brand-intro-controller">\n${runtime}\n    </script>`;
if(/<script id="brand-intro-controller">[\s\S]*?<\/script>/.test(shell))shell=shell.replace(/<script id="brand-intro-controller">[\s\S]*?<\/script>/,controller);
else shell=shell.replace('<script type="module" src="/src/main.tsx"></script>',controller+'\n    <script type="module" src="/src/main.tsx"></script>');
if(shell!==fs.readFileSync(shellPath,'utf8'))fs.writeFileSync(shellPath,shell);
const styles=shell.match(/<style id="brand-intro-styles">([\s\S]*?)<\/style>/)?.[1];
const markup=shell.match(/(<div id="brand-intro"[\s\S]*?)\s*<div id="root">/)?.[1];
if(!styles||!markup||!shell.includes(controller))throw Error('Opening source not found');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Opening Animation Review | Avance Law Partners</title><meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${styles}
body{margin:0;background:#000;color:#f6f1e4;font:14px/1.5 system-ui,sans-serif}
.review-controls{position:fixed;left:20px;right:20px;bottom:max(20px,env(safe-area-inset-bottom));z-index:1001;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:12px}
.review-controls button,.review-controls a{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;padding:10px 15px;min-height:44px;border:1px solid #c9a227;background:#000;color:#f6f1e4;border-radius:4px;text-decoration:none;font:inherit;cursor:pointer}
.review-controls :focus-visible{outline:2px solid #f6f1e4;outline-offset:4px}
.review-label{position:fixed;top:20px;left:20px;right:20px;text-align:center;color:#c9a227;z-index:1001;font-size:12px}
.review-complete{position:fixed;inset:0;display:grid;place-content:center;text-align:center;padding:24px}
</style></head><body data-opening-review="true">
<p class="review-label" id="review-label">Opening animation · one second · gavel & authentic logo</p>
<main class="review-complete"><p id="review-message">Opening complete.</p><p>Replay below or open the website.</p></main>
<div id="review-stage"></div>
<template id="intro-template">${markup}</template>
<nav class="review-controls" aria-label="Animation review"><button type="button" id="replay">Replay animation</button><button type="button" id="replay-slow">Slow replay ×0.5</button><a href="/">Open website</a></nav>
<p id="review-status" role="status" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)"></p>
<noscript><p>Enable JavaScript to replay the opening. Open the website using the link below.</p></noscript>
<script>${runtime}</script>
<script>
let playback=0;
async function replay(slow=false){
 const current=++playback;
 document.getElementById('review-stage').replaceChildren(document.getElementById('intro-template').content.cloneNode(true));
 document.getElementById('review-status').textContent='Opening animation playing.';
 document.getElementById('review-label').textContent=slow?'Slow review · two seconds (website opening: one second)':'Opening animation · one second · gavel & authentic logo';
 const result=await window.startAvanceOpening({slow});
 if(current!==playback)return;
 const message=result==='image-error'||result==='image-timeout'?'Logo unavailable; opening skipped.':result==='reduced-motion'?'Opening skipped for reduced motion.':result==='skipped'?'Opening skipped.':'Opening complete.';
 document.getElementById('review-message').textContent=message;
 document.getElementById('review-status').textContent=message+' Replay or open the website.';
}
document.getElementById('replay').addEventListener('click',()=>replay());
document.getElementById('replay-slow').addEventListener('click',()=>replay(true));
replay();
</script></body></html>`;
fs.writeFileSync(path.join(root,'public/brand-intro-preview.html'),html);
console.log('Generated one-second document opening and matching Replay review.');
