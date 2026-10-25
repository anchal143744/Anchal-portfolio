import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../app/components/hero-overlap-motion.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
const {foregroundOffset}=exports;
test('direct progress preserves the original 1.4x movement in both directions',()=>{
 const height=600, distance=840, extra=240;
 const position=p=>height+extra-distance*p+foregroundOffset(p,extra);
 for(let i=0;i<=100;i++) assert.ok(Math.abs(position(i/100)-height*(1-i/100))<1e-9);
 for(const p of [.2,.5,.8]) {
  assert.ok(position(p+.01)<position(p));
  assert.ok(position(p-.01)>position(p));
  assert.equal(position(p),position(p)); // no time-dependent state
 }
});
test('fast boundary crossings clamp to exact native-flow offsets',()=>{
 assert.equal(foregroundOffset(-2,240),-240);
 assert.ok(Math.abs(foregroundOffset(3,240))===0);
 assert.ok(Math.abs(foregroundOffset(.999999,240))<.001);
});

test('headline holds at the top, staggers, reverses and clamps without temporal state',()=>{
 const {headlineProgress}=exports;
 for(let i=0;i<3;i++) {
  assert.equal(headlineProgress(0,i),0);
  assert.equal(headlineProgress(.1,i),0);
  assert.equal(headlineProgress(2,i),1);
  assert.ok(headlineProgress(.5,i)>headlineProgress(.4,i));
 }
 assert.ok(headlineProgress(.3,0)>headlineProgress(.3,1));
 assert.ok(headlineProgress(.3,1)>headlineProgress(.3,2));
});
