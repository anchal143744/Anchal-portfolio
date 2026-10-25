// A single visual scroll coordinate shared by ScrollSmoother and local effects.
type Driver = { scrollTop: () => number; scrollTo: (position:number,smooth:boolean) => void };
let driver:Driver|null=null;
export function setScrollDriver(next:Driver|null){driver=next;}
export function visualScrollY(){return driver?driver.scrollTop():window.scrollY;}
export function scrollToPosition(options:{top:number;behavior?:ScrollBehavior}){
  if(driver)driver.scrollTo(options.top,options.behavior==='smooth');
  else window.scrollTo(options);
}
export function emitPortfolioScroll(){window.dispatchEvent(new Event('portfolio-scroll'));}

export function stickyRestTop(el:HTMLElement){return Number(el.dataset.smoothRestTop ?? parseFloat(getComputedStyle(el).top)) || 0;}
