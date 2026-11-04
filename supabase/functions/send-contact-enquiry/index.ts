const RECIPIENT = "isratarni1422@gmail.com";
const SENDER = "Avance Law Partners Website <website@mail.avancelawpartners.info>";

type EnquiryPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin?: string,
) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  return new Response(JSON.stringify(body), { status, headers });
}

Deno.serve(async (request: Request) => {
  const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const origin = request.headers.get("Origin") ?? undefined;

  if (allowedOrigins.length === 0) {
    return jsonResponse({ error: "The enquiry service is not configured yet." }, 503);
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return jsonResponse({ error: "This website origin is not allowed." }, 403);
  }

  const corsHeaders = new Headers({
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
  });
  if (origin) {
    corsHeaders.set("Access-Control-Allow-Origin", origin);
    corsHeaders.set("Vary", "Origin");
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, origin);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    return jsonResponse({ error: "The enquiry service is not configured yet." }, 503, origin);
  }

  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (contentLength > 12_000) {
    return jsonResponse({ error: "The message is too large." }, 413, origin);
  }

  let payload: EnquiryPayload;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid form submission." }, 400, origin);
    }
    payload = body as EnquiryPayload;
  } catch {
    return jsonResponse({ error: "Invalid form submission." }, 400, origin);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (
    !name || name.length > 120 ||
    !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length > 60 ||
    !subject || subject.length > 160 || /[\r\n]/.test(subject) ||
    !message || message.length > 5_000
  ) {
    return jsonResponse({ error: "Please check the form fields and try again." }, 400, origin);
  }

  const text = [
    "New website enquiry — Avance Law Partners",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Legal matter: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: SENDER,
        to: [RECIPIENT],
        reply_to: email,
        subject: `Website enquiry — ${subject}`,
        text,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Resend rejected contact email with status:", resendResponse.status);
      return jsonResponse(
        { error: "We could not send your enquiry right now. Please try again." },
        502,
        origin,
      );
    }

    const result = await resendResponse.json();
    return jsonResponse({ ok: true, id: result.id }, 200, origin);
  } catch {
    console.error("Resend contact email request failed.");
    return jsonResponse(
      { error: "We could not send your enquiry right now. Please try again." },
      502,
      origin,
    );
  }
});
