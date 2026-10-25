"use client";
import { useEffect, useRef, useState } from 'react';
import type { AlienController } from './alien-scene';
import './alien-sculpture.css';
export default function AlienSculpture() {
 const host=useRef<HTMLDivElement>(null),controller=useRef<AlienController|null>(null);
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  let disposed=false,started=false;
  const load=()=>{if(started)return;started=true;import('./alien-scene').then(({createAlien})=>{if(disposed)return;try{controller.current=createAlien(host.current!,()=>setReady(true),()=>{setFailed(true);setReady(false);});}catch{setFailed(true);}}).catch(()=>{if(!disposed)setFailed(true);});};
  const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){load();observer.disconnect();}},{rootMargin:'300px'});observer.observe(host.current!);
  return ()=>{disposed=true;observer.disconnect();controller.current?.dispose();controller.current=null;};
 },[]);
 return <div className="alien-sculpture" data-ready={ready} data-failed={failed}>
  <div className="alien-visual">
   <span className="about-feature-ring" aria-hidden="true"/>
   <img className="alien-poster" src="/alien-poster.png" alt="" aria-hidden="true" width="640" height="640"/>
   <div className="alien-canvas" ref={host} aria-hidden="true"/>
  </div>
 </div>;
}
