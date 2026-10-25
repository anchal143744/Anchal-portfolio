import assert from "node:assert/strict";
import test from "node:test";
import { submitEnquiry } from "../app/contact/submitEnquiry.ts";

const recipient = "anchalsharma1432006@gmail.com";
const enquiry = {
  firstName: "  Taylor  ",
  lastName: "  Example  ",
  email: "  taylor@example.com  ",
  message: "  I would like to discuss a product opportunity.  ",
};
const jsonResponse = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { "Content-Type": "application/json" },
});
const deliveryError = /Your message could not be sent/;

test("sends only the approved enquiry fields to the intended FormSubmit recipient", async () => {
  let calls = 0;
  const result = await submitEnquiry(` ${recipient} `, enquiry, async (url, options) => {
    calls++;
    assert.equal(url, `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`);
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "omit");
    assert.deepEqual(options.headers, { Accept: "application/json", "Content-Type": "application/json" });
    assert.equal(options.signal.aborted, false);
    assert.deepEqual(JSON.parse(options.body), {
      name: "Taylor Example",
      email: "taylor@example.com",
      message: "I would like to discuss a product opportunity.",
      _subject: "Anchal Sharma Portfolio — New enquiry",
      _template: "table",
      _url: "https://anchal-sharma-portfolio.brownbloom1024.chatgpt.site/contact",
    });
    return jsonResponse({ success: true, message: "The form was submitted successfully." });
  });
  assert.equal(calls, 1);
  assert.deepEqual(result, { activationRequired: false });
});

test("rejects invalid or oversized values before making a request", async () => {
  let calls = 0;
  const request = async () => { calls++; return jsonResponse({ success: true }); };
  const invalid = [
    ["", enquiry],
    ["bad-address", enquiry],
    [`${"a".repeat(250)}@example.com`, enquiry],
    [recipient, { ...enquiry, firstName: "  " }],
    [recipient, { ...enquiry, firstName: "a".repeat(81) }],
    [recipient, { ...enquiry, lastName: "a".repeat(81) }],
    [recipient, { ...enquiry, email: "bad-address" }],
    [recipient, { ...enquiry, email: "taylor@example.com\nBcc: other@example.com" }],
    [recipient, { ...enquiry, message: "short" }],
    [recipient, { ...enquiry, message: "a".repeat(4001) }],
  ];
  for (const [to, input] of invalid) {
    await assert.rejects(submitEnquiry(to, input, request), /Please check your name, email address and message/);
  }
  assert.equal(calls, 0);
});

test("accepts the documented string success state and an optional last name", async () => {
  const result = await submitEnquiry(recipient, { ...enquiry, lastName: "  " }, async (_url, options) => {
    assert.equal(JSON.parse(options.body).name, "Taylor");
    return jsonResponse({ success: "true", message: "Form submitted successfully" });
  });
  assert.deepEqual(result, { activationRequired: false });
});

test("does not report delivery on HTTP, malformed or rejected service responses", async () => {
  const responses = [
    () => jsonResponse({ success: true }, 503),
    () => new Response("<html>Unavailable</html>", { status: 200 }),
    () => jsonResponse({ success: false, message: "Internal provider detail" }),
    () => jsonResponse({ success: "false" }),
    () => jsonResponse({ success: "false", message: "This form has been deactivated." }),
    () => jsonResponse({ success: 1 }),
    () => jsonResponse({ success: 1, message: "Activation required" }),
    () => jsonResponse({ message: "Thank you" }),
    () => jsonResponse(null),
  ];
  for (const response of responses) {
    let calls = 0;
    await assert.rejects(submitEnquiry(recipient, enquiry, async () => { calls++; return response(); }), deliveryError);
    assert.equal(calls, 1, "a failed submission must not be retried automatically");
  }
});

test("keeps activation responses separate from an ordinary accepted submission", async () => {
  for (const message of [
    "Please activate your form using the activation email.",
    "Please confirm your email before receiving submissions.",
    "Email confirmation is required.",
  ]) {
    const result = await submitEnquiry(recipient, enquiry, async () => jsonResponse({ success: "true", message }));
    assert.deepEqual(result, { activationRequired: true });
  }
});

test("recognises the observed false-success activation response without claiming delivery", async () => {
  const activationMessage = "This form needs Activation. We've sent you an email containing an 'Activate Form' link. Just click it and your form will be actived!";
  for (const success of ["false", false]) {
    let calls = 0;
    const result = await submitEnquiry(recipient, enquiry, async () => {
      calls++;
      return new Response(JSON.stringify({ success, message: activationMessage }), {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    });
    assert.deepEqual(result, { activationRequired: true });
    assert.equal(calls, 1);
  }
});

test("returns a safe failure message for a network rejection without exposing details", async () => {
  await assert.rejects(submitEnquiry(recipient, enquiry, async () => {
    throw new Error("Sensitive provider diagnostics");
  }), (error) => deliveryError.test(error.message) && !error.message.includes("Sensitive"));
});
