import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, orderId, subject, message } = await req.json();

    // Check if SMTP credentials are provided in env
    const hasCredentials = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (hasCredentials) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: email,
        to: 'ekomart67@gmail.com',
        subject: `New Help Center Support Request: ${subject}`,
        text: `
          New support request from Ekomart Help Center:
          
          Full Name: ${name}
          User Email: ${email}
          Order ID: ${orderId || 'N/A'}
          Subject: ${subject}
          Message: ${message}
        `,
        html: `
          <h3>New Support Request</h3>
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>User Email:</strong> ${email}</p>
          <p><strong>Order ID:</strong> ${orderId || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      // Minimal safe implementation: Log the request if no credentials
      console.warn('SMTP credentials missing. Support request logged but not emailed:');
      console.log({ name, email, orderId, subject, message });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Your support request has been sent successfully.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Something went wrong. Please try again later.' 
    }, { status: 500 });
  }
}
