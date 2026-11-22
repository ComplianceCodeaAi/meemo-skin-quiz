// Proactive check-ins for the Meemo SMS bot. Call this endpoint on a
// schedule (e.g. Vercel Cron daily) with the CRON_SECRET bearer token:
//   Authorization: Bearer <CRON_SECRET>
// It texts every user whose check-in is due (3 days after their consult,
// then ~2 weeks, then ~monthly) via the Twilio REST API, which requires
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.
import { dueCheckins, markCheckinSent, CHECKIN_MESSAGE } from "./_bot.js";

async function sendSms(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const tok = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !tok || !from) throw new Error("Twilio env vars not configured");
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${sid}:${tok}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });
  if (!r.ok) throw new Error("Twilio send failed: " + r.status);
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret && (req.headers.authorization || "") !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const due = await dueCheckins();
    let sent = 0;
    for (const { phone } of due) {
      try {
        await sendSms(phone, CHECKIN_MESSAGE);
        await markCheckinSent(phone);
        sent++;
      } catch (e) { /* skip this user, try the rest */ }
    }
    return res.status(200).json({ due: due.length, sent });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
