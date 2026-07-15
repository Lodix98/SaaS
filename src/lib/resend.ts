import { Resend } from "resend";

function createResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export const resend = createResend() as Resend | null;
