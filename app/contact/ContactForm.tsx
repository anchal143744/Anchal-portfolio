"use client";

import { useRef, useState, type FormEvent } from "react";
import { homeSocials } from "../data/socials";
import { submitEnquiry } from "./submitEnquiry";

export default function ContactForm() {
  const recipient = homeSocials.find(item => item.id === "email")?.href.replace(/^mailto:/, "").trim() || "";
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const pending = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const first = String(data.get("firstName") || "").trim();
    const last = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!first || !message) {
      setStatus("Please enter your name and a message before continuing.");
      return;
    }
    if (!recipient || String(data.get("_honey") || "").trim()) {
      setStatus("Your message could not be submitted. Please use the direct email link.");
      return;
    }
    pending.current = true;
    setSending(true);
    setStatus("");
    try {
      const result = await submitEnquiry(recipient, { firstName: first, lastName: last, email, message });
      setStatus(result.activationRequired
        ? "Your enquiry is awaiting inbox activation. Please use the direct email link for now."
        : "Thank you. Your enquiry has been submitted. I’ll be in touch.");
      form.reset();
    } catch {
      setStatus("Your message could not be submitted. Your details are still here—please try again or use the direct email link.");
    } finally {
      pending.current = false;
      setSending(false);
    }
  }

  return <form className="enquiry-form" onSubmit={handleSubmit} aria-labelledby="enquiry-title" aria-busy={sending}>
    <div className="enquiry-heading">
      <p className="contact-kicker">YOUR NEXT PROJECT</p>
      <h2 id="enquiry-title">Let’s talk.</h2>
      <p>Tell me a little about yourself and your idea.</p>
    </div>
    <input type="text" name="_honey" hidden tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="enquiry-names">
      <label htmlFor="contact-first">First name <span aria-hidden="true">*</span>
        <input id="contact-first" name="firstName" autoComplete="given-name" placeholder="Your first name" required maxLength={80} disabled={sending} />
      </label>
      <label htmlFor="contact-last">Last name <span className="field-optional">(optional)</span>
        <input id="contact-last" name="lastName" autoComplete="family-name" placeholder="Your last name" maxLength={80} disabled={sending} />
      </label>
    </div>
    <label htmlFor="contact-email">Email <span aria-hidden="true">*</span>
      <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} disabled={sending} />
    </label>
    <label htmlFor="contact-message">Your project <span aria-hidden="true">*</span>
      <textarea id="contact-message" name="message" placeholder="What would you like to create?" required minLength={10} maxLength={4000} rows={6} disabled={sending} />
    </label>
    <p className="enquiry-note">* Required fields. Your name, email and message are sent via FormSubmit to Anchal’s inbox.</p>
    <button type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span></button>
    <p className="enquiry-status" role="status">{status}</p>
  </form>;
}
