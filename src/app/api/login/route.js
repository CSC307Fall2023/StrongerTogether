import sgMail from '@sendgrid/mail';
import { NextResponse } from "next/server";

export async function POST(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  let rawData = await req.text();
  const { email, code } = JSON.parse(rawData);
  console.log("Email is " + email + " and code is " + code);

  const msg = {
    to: email,
    from: 'strongertogether.noreply@gmail.com',
    subject: 'Your verification code',
    text: `Your Stronger Together verification code is: ${code}`,
    html: `<strong>Your verification code is: ${code}</strong>`,
  };

  try {
    await sgMail.send(msg);
    return NextResponse.json({ message: 'Email sent' }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
