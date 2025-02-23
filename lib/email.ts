import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.icloud.com",
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: "hudsor01@icloud.com",
    pass: "password", // replace with your email password
  },
});

export async function sendEmail({ to, subject, text }) {
  const message = {
    from: "hudsor01@icloud.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
