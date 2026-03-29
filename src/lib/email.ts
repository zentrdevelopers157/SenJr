// Resend Transactional Email Placeholder
// Usage: sendEmail({ to: 'user@example.com', subject: 'Session Confirmed', text: '...' })

export const sendEmail = async ({ to, subject, text, html }: { to: string, subject: string, text: string, html?: string }) => {
  console.log(`[RESEND MOCK] Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  
  // In production, use the resend package:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ ... });
  
  return { id: 'mock-email-id', success: true };
};
