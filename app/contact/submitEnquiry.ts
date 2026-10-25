type Enquiry = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const DELIVERY_ERROR = "Your message could not be sent. Please try again or use the direct email link.";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitEnquiry(
  recipient: string,
  enquiry: Enquiry,
  request: typeof fetch = fetch,
): Promise<{ activationRequired: boolean }> {
  const to = recipient.trim();
  const firstName = enquiry.firstName.trim();
  const lastName = enquiry.lastName.trim();
  const email = enquiry.email.trim();
  const message = enquiry.message.trim();

  if (!EMAIL.test(to) || to.length > 254 || !EMAIL.test(email) || email.length > 254
    || !firstName || firstName.length > 80 || lastName.length > 80
    || message.length < 10 || message.length > 4000) {
    throw new Error("Please check your name, email address and message.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await request(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({
        name: [firstName, lastName].filter(Boolean).join(" "),
        email,
        message,
        _subject: "Anchal Sharma Portfolio — New enquiry",
        _template: "table",
        _url: "https://anchal-sharma-portfolio.brownbloom1024.chatgpt.site/contact",
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(DELIVERY_ERROR);

    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("success" in result)) {
      throw new Error(DELIVERY_ERROR);
    }
    const serviceMessage = "message" in result && typeof result.message === "string" ? result.message : "";
    const activationRequired = /\bactivat(?:e|ion)\b|confirm(?:ation)?[\s-]+(?:your[\s-]+)?(?:email|e-mail)|(?:email|e-mail)[\s-]+confirm/i.test(serviceMessage);
    const accepted = result.success === true || result.success === "true";
    const awaitingActivation = (result.success === false || result.success === "false") && activationRequired;
    if (!accepted && !awaitingActivation) throw new Error(DELIVERY_ERROR);
    return { activationRequired };
  } catch {
    throw new Error(DELIVERY_ERROR);
  } finally {
    clearTimeout(timeout);
  }
}
