import type { APIRoute } from "astro";
import Stripe from "stripe";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

  let amount: number;
  let frequency: string;

  try {
    const body = await request.json();
    amount = body.amount;
    frequency = body.frequency || "onetime";
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const cents = Math.round(Number(amount) * 100);
  if (!cents || cents < 100) {
    return json({ error: "Minimum donation is $1" }, 400);
  }

  const siteUrl = import.meta.env.SITE_URL || "https://apps-for-change.github.io";
  const isRecurring = frequency === "monthly" || frequency === "annual";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      submit_type: isRecurring ? undefined : "donate",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Donation to Apps for Change" },
            unit_amount: cents,
            ...(isRecurring && {
              recurring: {
                interval: frequency === "annual" ? "year" : "month",
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}?donated=true`,
      cancel_url: `${siteUrl}#donate`,
    });

    return json({ url: session.url }, 200);
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
};

function json(data: object, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
