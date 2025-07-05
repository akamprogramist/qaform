import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { question } = await req.json();
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Q&A Bot" <${process.env.EMAIL_USER}>`,
      to: "akamprogramist@gmail.com",
      subject: "New Question Received",
      text: `📩 A new question was submitted:\n\n${question}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
