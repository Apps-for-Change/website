import type { APIRoute } from "astro";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adds a subscriber to Brevo using double opt-in: Brevo emails a
// confirmation link, and the person joins the list only after clicking it.
export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.BREVO_API_KEY;
  const listId = Number(import.meta.env.BREVO_LIST_ID);
  const templateId = Number(import.meta.env.BREVO_DOI_TEMPLATE_ID);
  if (!apiKey || !listId || !templateId) {
    return json({ error: "Newsletter sign-up isn't open yet. Please email info@appsforchange.org." }, 503);
  }

  let email = "";
  let firstName = "";
  let website = "";
  try {
    const body = await request.json();
    email = String(body.email || "").trim().toLowerCase();
    firstName = String(body.firstName || "").trim().slice(0, 60);
    website = String(body.website || "");
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot field: real people never fill it in, bots usually do.
  if (website) return json({ ok: true }, 200);
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const siteUrl = import.meta.env.SITE_URL || "https://appsforchange.org";
  const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      attributes: firstName ? { FIRSTNAME: firstName } : {},
      includeListIds: [listId],
      templateId,
      redirectionUrl: `${siteUrl}/newsletter-confirmed`,
    }),
  });

  if (res.ok) return json({ ok: true }, 200);
  console.error("Brevo subscribe failed", res.status, await res.text());
  return json({ error: "Something went wrong. Please try again or email info@appsforchange.org." }, 502);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}
