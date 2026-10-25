"use client";
import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { emitPortfolioScroll, setScrollDriver, visualScrollY, scrollToPosition } from '../lib/portfolio-scroll';
import './portfolio-scroll.css';

// Catch-up duration only; the hero's existing 1.4x distance remains unchanged.
export const SCROLL_SMOOTH_SECONDS = .8;
const stickySelectors='.site-header,.hero-hold,.sw-heading-pin,.sw-card-slot,.about-word-prefix,.site-footer,.contact-cta,.resume-side-panel';
type Sticky = {el:HTMLElement;parent:HTMLElement;top:number;offset:number};

export default function PortfolioScroll({children}:{children:ReactNode}){
  const wrapper=useRef<HTMLDivElement>(null),content=useRef<HTMLDivElement>(null);
  const pathname=usePathname();
  useEffect(()=>{
    let disposed=false,refreshFrame=0,generation=0;
    let smoother:import('gsap/ScrollSmoother').ScrollSmoother|null=null;
    let context:{revert:()=>void}|null=null;
    let pins:Sticky[]=[];
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const desktop=matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    const releasePins=()=>{for(const {el} of pins){el.removeAttribute('data-smooth-sticky');el.removeAttribute('data-smooth-rest-top');el.style.removeProperty('--smooth-pin-y');}pins=[];};
    // CSS sticky cannot follow a transformed scroller. Keep each element's native
    // flow space and clamp its independent translate to the same parent boundary.
    const updatePins=()=>{
      const reads=pins.map(pin=>({pin,rect:pin.el.getBoundingClientRect(),parent:pin.parent.getBoundingClientRect()}));
      for(const {pin,rect,parent} of reads){
        const natural=rect.top-pin.offset;
        const next=Math.max(0,Math.min(pin.top-natural,parent.bottom-natural-rect.height));
        if(Math.abs(next-pin.offset)>.01){pin.offset=next;pin.el.style.setProperty('--smooth-pin-y',`${next}px`);}
      }
    };
    const collectPins=()=>{
      releasePins();
      const contentNode=content.current;
      if(!contentNode?.isConnected)return;
      for(const el of contentNode.querySelectorAll<HTMLElement>(stickySelectors)){
        const css=getComputedStyle(el);
        if(css.position!=='sticky'||!el.parentElement)continue;
        pins.push({el,parent:el.parentElement,top:parseFloat(css.top)||0,offset:0});
      }
      pins.forEach(({el,top})=>{el.dataset.smoothRestTop=String(top);el.setAttribute('data-smooth-sticky','true');});
      updatePins();
    };
    const onNativeScroll=()=>{if(!smoother)emitPortfolioScroll();};
    window.addEventListener('scroll',onNativeScroll,{passive:true});
    const followHash=()=>{
      if(!smoother||!location.hash)return;
      let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(id);if(!target)return;
      const header=content.current?.querySelector('.site-header')?.getBoundingClientRect();
      scrollToPosition({top:Math.max(0,visualScrollY()+target.getBoundingClientRect().top-(header?.bottom||80)-24),behavior:'instant'});
    };
    const onAnchor=(event:MouseEvent)=>{
      if(!smoother||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const link=(event.target as Element).closest?.('a[href]');if(!link)return;
      const url=new URL(link.getAttribute('href')!,location.href);
      if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;
      event.preventDefault();history.pushState(null,'',url.hash);
      // Preserve existing hash consumers (capability selection, project targeting).
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      const temporary=!target.hasAttribute('tabindex');if(temporary)target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});if(temporary)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});
    };
    document.addEventListener('click',onAnchor);window.addEventListener('hashchange',followHash);
    let sizeObserver:ResizeObserver|null=null,attributes:MutationObserver|null=null,bodyObserver:MutationObserver|null=null;
    const configure=async()=>{
      const current=++generation;
      context?.revert();context=null;smoother=null;setScrollDriver(null);releasePins();
      document.documentElement.removeAttribute('data-portfolio-smooth');
      sizeObserver?.disconnect();attributes?.disconnect();bodyObserver?.disconnect();
      if(motion.matches||!desktop.matches||disposed){emitPortfolioScroll();return;}
      try{
        const [{gsap},{ScrollTrigger},{ScrollSmoother}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger'),import('gsap/ScrollSmoother')]);
        if(disposed||current!==generation||motion.matches||!desktop.matches)return;
        const wrapperNode=wrapper.current,contentNode=content.current,bodyNode=document.body;
        if(!wrapperNode?.isConnected||!contentNode?.isConnected||!bodyNode?.isConnected)return;
        gsap.registerPlugin(ScrollTrigger,ScrollSmoother);
        document.documentElement.dataset.portfolioSmooth='true';
        context=gsap.context(()=>{
          smoother=ScrollSmoother.create({wrapper:wrapperNode,content:contentNode,smooth:SCROLL_SMOOTH_SECONDS,smoothTouch:false,effects:false,normalizeScroll:false,
            onUpdate:()=>{updatePins();emitPortfolioScroll();},
            onFocusIn:()=>false,
          });
        },wrapperNode);
        setScrollDriver(smoother);
        const refresh=()=>{
          if(refreshFrame||disposed||!contentNode.isConnected)return;
          refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;if(!smoother||!contentNode.isConnected)return;collectPins();ScrollTrigger.refresh();updatePins();emitPortfolioScroll();});
        };
        sizeObserver=new ResizeObserver(refresh);sizeObserver.observe(contentNode);
        attributes=new MutationObserver(refresh);attributes.observe(contentNode,{subtree:true,attributes:true,attributeFilter:['data-overlap','data-stacked','data-keyboard','data-layered','data-sticky']});
        // Existing body-scroll locks (project dialogs) also stop the smoother.
        bodyObserver=new MutationObserver(()=>smoother?.paused(bodyNode.style.overflow==='hidden'));
        bodyObserver.observe(bodyNode,{attributes:true,attributeFilter:['style']});
        collectPins();window.dispatchEvent(new Event('resize'));refresh();
        document.fonts.ready.then(()=>{if(!disposed)refresh();});
        requestAnimationFrame(()=>{if(!disposed)followHash();});
      }catch(error){context?.revert();smoother=null;setScrollDriver(null);releasePins();document.documentElement.removeAttribute('data-portfolio-smooth');if(!disposed)console.error('Failed to configure portfolio scrolling.',error);}
    };
    const focus=(event:FocusEvent)=>{
      if(!smoother||!(event.target instanceof HTMLElement)||!content.current?.contains(event.target))return;
      const r=event.target.getBoundingClientRect(),header=content.current.querySelector('.site-header')?.getBoundingClientRect().bottom||80;
      if(r.top<header+12||r.bottom>innerHeight-12)scrollToPosition({top:Math.max(0,visualScrollY()+r.top-header-24),behavior:'instant'});
    };
    document.addEventListener('focusin',focus);
    motion.addEventListener('change',configure);desktop.addEventListener('change',configure);configure();
    return()=>{disposed=true;cancelAnimationFrame(refreshFrame);sizeObserver?.disconnect();attributes?.disconnect();bodyObserver?.disconnect();context?.revert();setScrollDriver(null);releasePins();document.documentElement.removeAttribute('data-portfolio-smooth');window.removeEventListener('scroll',onNativeScroll);document.removeEventListener('click',onAnchor);window.removeEventListener('hashchange',followHash);document.removeEventListener('focusin',focus);motion.removeEventListener('change',configure);desktop.removeEventListener('change',configure);};
  },[pathname]);
  return <div ref={wrapper} id="portfolio-scroll-wrapper"><div ref={content} id="portfolio-scroll-content">{children}</div></div>;
}
