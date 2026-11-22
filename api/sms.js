// Twilio SMS/MMS webhook for the Meemo text bot.
// Point your Twilio number's "A message comes in" webhook at:
//   https://<your-domain>/api/sms   (HTTP POST)
// Inbound replies are sent via TwiML, so no Twilio credentials are needed
// for the conversation itself. Set TWILIO_AUTH_TOKEN to enable request
// signature validation, and the TWILIO_* vars + CRON_SECRET for check-ins.
import { handleMessage } from "./_bot.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return Object.fromEntries(new URLSearchParams(raw));
}

async function fetchMediaAsBase64(url) {
  // Twilio media URLs need basic auth with the account credentials.
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const tok = process.env.TWILIO_AUTH_TOKEN;
  const headers = sid && tok ? { Authorization: "Basic " + Buffer.from(`${sid}:${tok}`).toString("base64") } : {};
  const r = await fetch(url, { headers });
  if (!r.ok) return null;
  const buf = Buffer.from(await r.arrayBuffer());
  return buf.toString("base64");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = await readBody(req);
    const from = body.From;
    const text = body.Body || "";
    if (!from) return res.status(400).json({ error: "Missing From" });

    let mediaBase64 = null;
    const numMedia = parseInt(body.NumMedia || "0");
    if (numMedia > 0 && body.MediaUrl0 && (body.MediaContentType0 || "").startsWith("image/")) {
      try { mediaBase64 = await fetchMediaAsBase64(body.MediaUrl0); } catch (e) { mediaBase64 = null; }
    }

    const replies = await handleMessage(from, text, mediaBase64);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response>${replies.map((m) => `<Message>${esc(m)}</Message>`).join("")}</Response>`;
    res.setHeader("Content-Type", "text/xml");
    return res.status(200).send(twiml);
  } catch (e) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>Meemo hit a snag — try texting me again in a moment.</Message></Response>`;
    res.setHeader("Content-Type", "text/xml");
    return res.status(200).send(twiml);
  }
}
