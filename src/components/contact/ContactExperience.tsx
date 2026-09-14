"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/data/site";

const ContactScene = dynamic(() => import("./ContactScene"), { ssr:false });
const inquiryOptions = ["AI / INTELLIGENT SYSTEM", "PRODUCT / SOFTWARE", "UI / UX", "CREATIVE TECHNOLOGY", "OTHER"] as const;

function ContactVisual() {
  const [enabled,setEnabled]=useState(false); const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{ const node=ref.current; if(!node||window.matchMedia("(max-width: 600px), (prefers-reduced-motion: reduce)").matches)return; const observer=new IntersectionObserver(([entry])=>setEnabled(entry.isIntersecting),{rootMargin:"160px"}); observer.observe(node); return()=>observer.disconnect(); },[]);
  return <div ref={ref} className="contact-scene" aria-hidden="true">{enabled&&<ContactScene/>}<div className="contact-scene-fallback"><i/><i/><b>+</b></div><span>IDEA / PEOPLE / TECHNOLOGY</span></div>;
}

export function ContactExperience() {
  const reduced=useReducedMotion(); const [copied,setCopied]=useState(false); const [inquiry,setInquiry]=useState<(typeof inquiryOptions)[number]>(inquiryOptions[0]);
  const inquiryHref=useMemo(()=>{ const subject=`Project inquiry — ${inquiry.replace(" / ", " / ").replace(/\b\w/g,c=>c)}`; const body=`Hi Anchal,\n\nI'd like to discuss a ${inquiry.toLowerCase()} project.\n\nA little context:\n`; return `mailto:${site.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; },[inquiry]);
  const copyEmail=async()=>{ try { await navigator.clipboard.writeText(site.emailAddress); setCopied(true); window.setTimeout(()=>setCopied(false),1800); } catch { setCopied(false); } };
  return <main className="contact-page">
    <section className="contact-hero"><div className="container contact-hero-grid"><div className="contact-hero-copy"><p className="section-label">06 / CONTACT</p><motion.h1 initial={reduced?false:{opacity:0,y:44}} animate={{opacity:1,y:0}} transition={{duration:.9}}><span>LET&apos;S BUILD</span><span>SOMETHING</span><span>WORTH</span><em>REMEMBERING.</em></motion.h1><p className="contact-intro">Whether you&apos;re building an intelligent product, a complex software system, or an experience that needs to feel different — I&apos;m interested in thoughtful problems worth solving.</p><a className="contact-primary" href={site.email}>LET&apos;S TALK <span>↗</span></a></div><ContactVisual/></div></section>

    <section className="contact-channels"><div className="container"><p className="section-label">01 / OPEN A CHANNEL</p><div className="contact-index">
      <div><span>EMAIL</span><a href={site.email}>{site.emailAddress}</a><button onClick={copyEmail} aria-label={`Copy ${site.emailAddress} to clipboard`}><span aria-live="polite">{copied?"COPIED":"COPY EMAIL"}</span></button></div>
      {[site.channels.linkedin,site.channels.github].map(channel=><div key={channel.label}><span>{channel.label.toUpperCase()}</span><a href={channel.href} target="_blank" rel="noreferrer" aria-label={`${channel.label}${channel.configured?" profile":" URL placeholder — configure in site.ts"}`}>{channel.configured?"VIEW PROFILE ↗":"CONFIGURE PROFILE URL ↗"}</a><small>{channel.configured?"PUBLIC PROFILE":"CONFIGURABLE / SITE.TS"}</small></div>)}
    </div><div className="contact-context"><p><i/> {site.availability}</p><p>{site.location.map(item=><span key={item}>{item}</span>)}</p></div></div></section>

    <section className="contact-inquiry"><div className="container"><p className="section-label">02 / PROJECT INQUIRY</p><div className="inquiry-grid"><div><h2>WHAT ARE YOU<br/><em>BUILDING?</em></h2><p>Choose the closest direction. Your email client will open with a useful starting point — nothing is submitted here.</p></div><div className="inquiry-options" role="radiogroup" aria-label="Project inquiry type">{inquiryOptions.map((option,i)=><button role="radio" aria-checked={inquiry===option} className={inquiry===option?"active":""} key={option} onClick={()=>setInquiry(option)}><span>0{i+1}</span><strong>{option}</strong><i aria-hidden="true"/></button>)}</div></div><a className="start-conversation" href={inquiryHref}>START THE CONVERSATION <span>↗</span><small>SUBJECT / PROJECT INQUIRY — {inquiry}</small></a></div></section>

    <section className="contact-closing"><div className="container"><p>UNTIL THE</p><h2>NEXT <em>IDEA.</em></h2><Link href="/">↗ {site.name.toUpperCase()}</Link><footer><span>© {site.name.toUpperCase()}</span><p>{site.role.map(role=><span key={role}>{role}</span>)}</p><nav aria-label="Footer navigation">{[["WORK","/work"],["ABOUT","/about"],["LAB","/lab"],["CONTACT","/contact"]].map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</nav><div>{site.social.map(item=><a key={item.label} href={item.href}>{item.label}</a>)}</div></footer></div></section>
  </main>;
}
