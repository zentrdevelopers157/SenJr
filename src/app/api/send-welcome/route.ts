import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Mail server configuration missing' }, { status: 500 });
    }
    const resend = new Resend(RESEND_API_KEY);
    const { email, name, role } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing email or name' }, { status: 400 });
    }

    const isMentor = role === 'mentor';
    const firstName = name.split(' ')[0];

    const html = isMentor 
      ? `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 32px; font-weight: 900; color: #0B1020; margin: 0;">Sen<span style="color: #f97316;">jr</span></h1>
          </div>
          <h2 style="font-size: 24px; line-height: 1.2; font-weight: 800; color: #0B1020;">Application Received, ${firstName}! 🚀</h2>
          <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-top: 16px;">
            Your application to mentor on Senjr is received. We’ll verify your credentials and get back to you within 48 hours.
          </p>
          <p style="font-size: 16px; color: #475569; line-height: 1.6;">
            Once verified, you'll be able to set your rates, availability, and start guiding the next generation of achievers.
          </p>
          <div style="margin-top: 32px; text-align: center;">
            <a href="https://senjr.co/dashboard" style="background: #f97316; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">Go to Dashboard →</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px; margin-bottom: 24px;" />
          <div style="text-align: center;">
             <p style="font-size: 14px; color: #94a3b8; margin-bottom: 12px;">Senjr — Senior to Junior Mentorship. 28 countries and counting.</p>
             <div style="display: flex; justify-content: center; gap: 16px;">
                <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px;">Twitter</a>
                <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px;">LinkedIn</a>
                <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px;">Instagram</a>
             </div>
          </div>
        </div>
      `
      : `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 32px; font-weight: 900; color: #0B1020; margin: 0;">Sen<span style="color: #2563EB;">jr</span></h1>
          </div>
          <h2 style="font-size: 24px; line-height: 1.2; font-weight: 800; color: #0B1020;">Welcome to Senjr Beta, ${firstName}! 🎉</h2>
          <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-top: 16px;">
            You’re one of the first people inside. As a beta tester, you get <strong>3 months of Pro free</strong> when we launch.
          </p>
          <p style="font-size: 16px; color: #475569; line-height: 1.6;">
            Confirm your email to lock in your spot and start connecting with verified seniors.
          </p>
          <div style="margin-top: 32px; text-align: center;">
            <a href="https://senjr.co/dashboard" style="background: #2563EB; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">Confirm My Email →</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px; margin-bottom: 24px;" />
          <div style="text-align: center;">
             <p style="font-size: 14px; color: #94a3b8; margin-bottom: 12px;">Senjr — Senior to Junior Mentorship. 2,400+ students on waitlist.</p>
             <div style="display: flex; justify-content: center; gap: 16px;">
                <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px;">Twitter</a>
                <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px;">LinkedIn</a>
                <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px;">Instagram</a>
             </div>
          </div>
        </div>
      `;

    const { data, error } = await resend.emails.send({
      from: 'Senjr <onboarding@resend.dev>', // Replace with custom domain later
      to: [email],
      subject: isMentor ? 'Senjr Mentor Application Received' : 'Welcome to Senjr Beta!',
      html,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
