import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';

function setup(initialReduced=false) {
 const events=()=>{const handlers=new Map();return {addEventListener:(n,f)=>handlers.set(n,f),removeEventListener:n=>handlers.delete(n),emit:(n,e)=>handlers.get(n)?.(e),handlers};};
 const canvas={...events(),setAttribute(){},remove(){}};
 const host={...events(),clientWidth:400,clientHeight:400,appendChild(){},getBoundingClientRect:()=>({left:0,top:0,width:400,height:400})};
 const document={...events(),hidden:false,createElement:()=>({width:0,height:0,getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})})};
 const reduced={...events(),matches:initialReduced},fine={...events(),matches:true};
 let visibility,frames=new Map(),sequence=0,renders=0,scene;
 class Renderer {domElement=canvas;setClearColor(){}setPixelRatio(){}setSize(){}dispose(){}render(s){renders++;scene=s;}}
 class Environment extends THREE.Scene {dispose(){}}
 class PMREM {fromScene(){return {texture:new THREE.Texture(),dispose(){}};}dispose(){}}
 const fake={...THREE,WebGLRenderer:Renderer,PMREMGenerator:PMREM};
 const exports={};const context={exports,require:name=>name==='three'?fake:{RoomEnvironment:Environment},document,innerWidth:1440,devicePixelRatio:1,matchMedia:q=>q.includes('reduced')?reduced:fine,requestAnimationFrame:f=>{frames.set(++sequence,f);return sequence;},cancelAnimationFrame:id=>frames.delete(id),ResizeObserver:class{observe(){}disconnect(){}},IntersectionObserver:class{constructor(f){visibility=f;}observe(){}disconnect(){}}};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../app/components/alien-scene.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);
 let failures=0;const controller=exports.createAlien(host,()=>{},()=>failures++);
 return {controller,host,document,reduced,canvas,show:value=>visibility([{isIntersecting:value}]),tick(now){const current=[...frames.values()];frames.clear();current.forEach(f=>f(now));},get pending(){return frames.size;},get renders(){return renders;},get failures(){return failures;},get face(){return scene.children.find(x=>x.type==='Group').children.find(x=>x.type==='Group');}};
}
test('alien stops work offscreen, when paused, hidden and disposed; resumes explicitly',()=>{
 const s=setup();assert.equal(s.pending,0);s.show(true);s.tick(1000);s.tick(1040);assert.equal(s.renders,2);
 s.controller.pause(true);s.tick(1080);assert.equal(s.pending,0);const frozen=s.renders;s.tick(1120);assert.equal(s.renders,frozen);
 s.controller.pause(false);s.tick(1160);assert.equal(s.pending,1);
 s.show(false);assert.equal(s.pending,0);s.show(true);s.tick(1200);
 s.document.hidden=true;s.document.emit('visibilitychange');assert.equal(s.pending,0);
 s.document.hidden=false;s.document.emit('visibilitychange');assert.equal(s.pending,1);
 s.controller.dispose();assert.equal(s.pending,0);assert.equal(s.host.handlers.size,0);
});
test('reduced motion draws a resting frame; local pointer follows and returns without moving shoulders as a rigid body',()=>{
 const s=setup(true);s.show(true);s.tick(1000);assert.equal(s.pending,0);
 s.reduced.matches=false;s.reduced.emit('change');s.host.emit('pointermove',{clientX:390,clientY:100});
 for(let t=1040;t<2040;t+=40)s.tick(t);assert.ok(s.face.rotation.y>.10);
 s.host.emit('pointerleave');for(let t=2040;t<4040;t+=40)s.tick(t);assert.ok(Math.abs(s.face.rotation.y)<.001);
 s.reduced.matches=true;s.reduced.emit('change');s.tick(4080);assert.equal(s.pending,0);assert.equal(s.face.rotation.y,0);s.controller.dispose();
});
test('context loss selects fallback and never restarts a lost renderer',()=>{
 const s=setup();s.show(true);s.tick(1000);s.canvas.emit('webglcontextlost',{preventDefault(){}});assert.equal(s.failures,1);assert.equal(s.pending,0);s.show(true);assert.equal(s.pending,0);s.controller.dispose();
});
