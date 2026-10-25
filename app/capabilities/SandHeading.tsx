"use client";
import { useEffect, useRef } from 'react';
import './sand-heading.css';

// Visual reference: Dustin Dwayne, https://codepen.io/dustindwayne/pen/qEqzrzo
// Adapted from the simulation supplied by the user: edge-weighted release,
// cellular pile settling and staggered cubic reformation. See sand-heading.md.
export const sandSettings = {
  grainSize: 2.2, mobileGrainSize: 2, maxParticles: 6500,
  colour: '#0b0b0b', accent: '#ff6800', gravity: 850,
  releaseTestsPerStep: 1500, releaseChance: .022, airDrag: .992, settlingPasses: 5,
  hold: 1.8, settle: .8, reform: 3.2,
  secondaryMessage: '',
};
type Grain = {x:number;y:number;homeX:number;homeY:number;vx:number;vy:number;release:number;settled:boolean;released:boolean;fromX:number;fromY:number;colour:string;};

export default function SandHeading() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = root.current!;
    const canvas = stage.querySelector('canvas')!;
    const heading = stage.querySelector('h1')!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let grains:Grain[] = [], width=0,height=0,cell=2, dpr=1;
    let fixed = new Uint8Array(0), pile = new Int32Array(0), loose:number[] = [], cols=0, rows=0;
    let mask:HTMLCanvasElement;
    let phase:'hold'|'collapse'|'settle'|'reform'='hold', elapsed=0;
    let frame=0,last=0,accumulator=0,resizeTimer=0,visible=false,disposed=false,ready=false,fontsLoaded=false;
    let measuredWidth=0, firstBuild=true;
    const total = sandSettings;
    const reset = () => {
      phase='hold';elapsed=0;pile.fill(-1);fixed.fill(0);loose=grains.map((_,i)=>i);
      grains.forEach(g=>{fixed[Math.round(g.homeY/cell)*cols+Math.round(g.homeX/cell)]=1;});
      grains.forEach(g=>{g.x=g.homeX;g.y=g.homeY;g.vx=(Math.random()-.5)*44;g.vy=0;g.settled=false;g.released=false;});
    };
    const draw = () => {
      if(stage.dataset.phase!==phase)stage.dataset.phase=phase;
      ctx.clearRect(0,0,width,height);
      if (phase==='hold') {ctx.drawImage(mask,0,0,width,height);return;}
      const mix = phase==='reform' ? Math.max(0,(elapsed/total.reform-.94)/.06) : phase==='collapse' ? Math.max(0,1-elapsed/.18) : 0;
      ctx.globalAlpha=1-mix;
      for(const g of grains){ctx.fillStyle=g.colour;ctx.fillRect(g.x,g.y,cell*.92,cell*.92);}
      ctx.globalAlpha=mix;
      if(mix>0)ctx.drawImage(mask,0,0,width,height);
      ctx.globalAlpha=1;
    };
    const advance = (dt:number) => {
      elapsed+=dt;
      if(phase==='hold') {if(elapsed>=total.hold){phase='collapse';elapsed=0;}return;}
      if(phase==='collapse'||phase==='settle') {
        // Same random release attempts as the supplied demo, at a fixed 60 Hz.
        if(phase==='collapse')for(let attempt=0;attempt<total.releaseTestsPerStep&&loose.length;attempt++){
          const n=Math.floor(Math.random()*loose.length),g=grains[loose[n]];
          const c=Math.round(g.homeX/cell),r=Math.round(g.homeY/cell),i=r*cols+c;
          const edge=r===rows-1||!fixed[i+cols]||c===0||c===cols-1||!fixed[i-1]||!fixed[i+1];
          if(Math.random()<total.releaseChance*(edge?3.3:1)){
            fixed[i]=0;g.released=true;g.vy=40+Math.random()*110;
            loose[n]=loose[loose.length-1];loose.pop();
          }
        }
        const solid=(c:number,r:number)=>r>=rows||c<0||c>=cols||(r>=0&&pile[r*cols+c]>=0);
        for(let id=0;id<grains.length;id++) {
          const g=grains[id];if(g.settled||!g.released)continue;
          const oldRow=Math.floor(g.y/cell);
          g.vx+=(Math.sin(elapsed*2+id)*55)*dt;
          g.vy+=total.gravity*dt;g.vx*=total.airDrag;g.vy*=total.airDrag;
          g.x=Math.max(0,Math.min((cols-1)*cell,g.x+g.vx*dt));g.y+=g.vy*dt;
          const c=Math.floor(g.x/cell),nextRow=Math.min(rows,Math.floor((g.y+cell)/cell));
          for(let r=Math.max(0,oldRow);r<=nextRow;r++)if(solid(c,r)){
            let landing=r-1;while(landing>=0&&solid(c,landing))landing--;
            if(landing>=0){pile[landing*cols+c]=id;g.x=c*cell;g.y=landing*cell;g.settled=true;}break;
          }
        }
        // Visit occupied grains only, not every unused cell in the canvas.
        for(let pass=0;pass<total.settlingPasses;pass++)for(let id=grains.length-1;id>=0;id--){
          const g=grains[id];if(!g.settled)continue;
          const c=Math.round(g.x/cell),r=Math.round(g.y/cell),side=Math.random()<.5?-1:1;
          const destination=!solid(c,r+1)?c:!solid(c+side,r+1)?c+side:!solid(c-side,r+1)?c-side:-1;
          if(destination>=0){pile[r*cols+c]=-1;pile[(r+1)*cols+destination]=id;g.x=destination*cell;g.y=(r+1)*cell;}
        }
        if(phase==='collapse'&&!loose.length&&grains.every(g=>g.settled)){phase='settle';elapsed=0;}
        else if(phase==='settle'&&elapsed>=total.settle){phase='reform';elapsed=0;grains.forEach(g=>{g.fromX=g.x;g.fromY=g.y;});}
      } else {
        for(const g of grains){
          const delay=g.release;
          const t=Math.max(0,Math.min(1,(elapsed-delay)/(total.reform-.9)));
          const eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
          g.x=g.fromX+(g.homeX-g.fromX)*eased+Math.sin(t*Math.PI)*Math.sin(g.homeY)*7;
          g.y=g.fromY+(g.homeY-g.fromY)*eased-Math.sin(eased*Math.PI)*height*.08;
        }
        if(elapsed>=total.reform){reset();}
      }
    };
    const active = () => ready && visible && !document.hidden && !reduced.matches;
    const tick = (now:number) => {
      frame=0;if(!active()){last=0;return;}
      const dt=last?Math.min((now-last)/1000,.067):0;last=now;accumulator+=dt;
      let steps=0;while(accumulator>=1/60&&steps<4){advance(1/60);accumulator-=1/60;steps++;}
      draw();frame=requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);frame=0;last=0;accumulator=0;
      const staticMode = reduced.matches;
      stage.dataset.static=String(staticMode);
      if(staticMode&&ready){reset();draw();}
      if(active())frame=requestAnimationFrame(tick);
    };
    const buildHeadingMask = () => {
      if(disposed)return;
      try {
        stage.dataset.ready='false';
        width=stage.clientWidth;height=stage.clientHeight;
        measuredWidth=width;dpr=Math.min(devicePixelRatio||1,width<600?1:1.5);
        canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
        ctx.setTransform(dpr,0,0,dpr,0,0);
        const lines=Array.from(heading.querySelectorAll<HTMLElement>('.sand-line')).filter(line=>getComputedStyle(line).display!=='none');
        mask=document.createElement('canvas');mask.width=canvas.width;mask.height=canvas.height;
        const ink=mask.getContext('2d')!;ink.scale(dpr,dpr);
        heading.style.removeProperty('font-size');
        let style=getComputedStyle(heading),size=parseFloat(style.fontSize);
        ink.font=`${style.fontWeight} ${size}px ${style.fontFamily}`;
        ink.letterSpacing=style.letterSpacing;
        const widest=Math.max(...lines.map(line=>ink.measureText(line.textContent||'').width));
        size=Math.min(size,size*(width-4)/widest);heading.style.fontSize=`${size}px`;
        style=getComputedStyle(heading);ink.font=`${style.fontWeight} ${size}px ${style.fontFamily}`;ink.letterSpacing=style.letterSpacing;
        const bounds=stage.getBoundingClientRect();
        for(const line of lines){
          const rect=line.getBoundingClientRect(), text=line.textContent||'';
          const metrics=ink.measureText(text),ascent=metrics.fontBoundingBoxAscent||size*.8,descent=metrics.fontBoundingBoxDescent||size*.2;
          const y=rect.top-bounds.top+(rect.height-ascent-descent)/2+ascent;
          ink.fillStyle=total.colour;ink.fillText(text,rect.left-bounds.left,y);
          const accent=line.querySelector('b')?.textContent||'';
          if(accent){const base=text.slice(0,-accent.length);ink.fillStyle=total.accent;ink.fillText(accent,rect.left-bounds.left+ink.measureText(base).width,y);}
        }
        const pixels=ink.getImageData(0,0,mask.width,mask.height).data;
        cell=width<600?total.mobileGrainSize:total.grainSize;
        const sample = () => {
          const list:Grain[]=[];
          const textBottom=heading.getBoundingClientRect().bottom-bounds.top;
          for(let y=0;y<Math.min(height,textBottom+2);y+=cell)for(let x=0;x<width;x+=cell){
            const px=Math.min(mask.width-1,Math.floor(x*dpr)),py=Math.min(mask.height-1,Math.floor(y*dpr));const i=(py*mask.width+px)*4;
            if(pixels[i+3]<100)continue;
            list.push({x,y,homeX:x,homeY:y,vx:0,vy:0,release:Math.random()*.65,settled:false,released:false,fromX:x,fromY:y,colour:pixels[i]>150?total.accent:total.colour});
          }return list;
        };
        grains=sample();if(grains.length>total.maxParticles){cell*=Math.sqrt(grains.length/total.maxParticles)*1.02;grains=sample();}
        cols=Math.ceil(width/cell);rows=Math.floor((height-12)/cell);fixed=new Uint8Array(cols*rows);pile=new Int32Array(cols*rows);reset();
        if(firstBuild&&!reduced.matches){
          // Open with a complete pile rising into the heading; later cycles collapse normally.
          const stacks=new Float32Array(cols);
          for(const g of [...grains].sort(()=>Math.random()-.5)){
            const col=Math.max(0,Math.min(cols-1,Math.floor((g.homeX+(Math.random()-.5)*20)/cell)));
            g.x=col*cell;g.y=height-12-cell-stacks[col];stacks[col]+=cell;
            g.fromX=g.x;g.fromY=g.y;
          }
          phase='reform';elapsed=0;
        }
        firstBuild=false;draw();ready=true;stage.dataset.ready='true';sync();
      }catch{ready=false;stage.dataset.ready='false';cancelAnimationFrame(frame);}
    };
    const queueResize = () => {
      if(!fontsLoaded)return;
      if(Math.abs(stage.clientWidth-measuredWidth)<1 && ready && dpr===Math.min(devicePixelRatio||1,width<600?1:1.5))return;
      stage.dataset.ready='false';cancelAnimationFrame(frame);clearTimeout(resizeTimer);resizeTimer=window.setTimeout(buildHeadingMask,160);
    };
    const resize = new ResizeObserver(queueResize);
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
    intersection.observe(stage);resize.observe(stage);
    window.addEventListener('resize',queueResize);
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
    document.fonts.ready.then(()=>{if(!disposed){fontsLoaded=true;buildHeadingMask();}});
    return()=>{disposed=true;cancelAnimationFrame(frame);clearTimeout(resizeTimer);resize.disconnect();intersection.disconnect();window.removeEventListener('resize',queueResize);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);};
  },[]);
  return <div className="sand-heading-block">
    <div className="sand-heading-stage" ref={root}>
      <h1 aria-label="PRODUCT IDEAS. CLEAR DIRECTION.">
        <span className="sand-line" aria-hidden="true">PRODUCT IDEAS. <b>CLEAR DIRECTION.</b></span>
      </h1>
      <canvas aria-hidden="true" />
    </div>
    {sandSettings.secondaryMessage&&<p>{sandSettings.secondaryMessage}</p>}
  </div>;
}
