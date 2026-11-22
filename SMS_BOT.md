# Meemo SMS Bot

The Meemo skincare consult as an ongoing text conversation — no app. A user
texts the number, does the 11-question consult by SMS, optionally sends a
selfie (MMS) for a skin scan, gets a routine built only from the verified
product catalog, and can keep texting afterward: questions, "my skin feels
tight," swap requests, and proactive check-ins (day 3, ~2 weeks, ~monthly).

## Files

- `api/sms.js` — Twilio webhook. Point the number's "A message comes in"
  webhook at `https://<your-domain>/api/sms` (POST). Replies go out as TwiML,
  so the conversation itself needs no Twilio credentials.
- `api/_bot.js` — Conversation engine: per-user state, quiz flow, catalog
  recommendation (same verified catalog + rules as the web app), and the
  ongoing-chat system prompt with the user's profile and routine in context.
- `api/checkin.js` — Sends due check-ins via the Twilio REST API. Wired as a
  daily Vercel Cron in `vercel.json` (17:00 UTC).

## Setup

1. Create a Twilio account and buy an SMS-capable number.
2. In the Twilio console for that number, set the Messaging webhook to
   `https://<your-domain>/api/sms`, method POST.
3. Add env vars in Vercel:
   - `ANTHROPIC_API_KEY` — already set (shared with the web app).
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
     (E.164, e.g. +15551234567) — needed for selfie downloads and check-ins.
   - `CRON_SECRET` — any long random string; Vercel Cron sends it as a
     bearer token to `/api/checkin` automatically.
   - Conversation memory: add a Vercel KV / Upstash Redis store and set
     `KV_REST_API_URL` + `KV_REST_API_TOKEN`. Without it, state is kept in
     memory and resets when the function cold-starts (demo only).
4. Deploy. Text the number to try it.

## Conversation commands

- `RESTART` — start a fresh consult.
- `ROUTINE` — resend the current routine.
- `SKIP` — skip a quiz question or the selfie.
- `STOP` — Twilio-level opt-out (carrier standard).

## Notes

- US numbers: register an A2P 10DLC brand/campaign in Twilio, or use a
  toll-free number with verified use case, or carriers may filter messages.
- The bot gives cosmetic guidance only; the disclaimer is sent in the first
  message and the chat prompt routes medical-sounding issues to a
  dermatologist.
