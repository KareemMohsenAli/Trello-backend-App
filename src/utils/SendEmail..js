import nodemailer from "nodemailer";
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"kemo kamokemo 👻" <${process.env.email}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
  return info;
};

export const emailVerificationTamplete = (link) => {
  return `
    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f2f2f2; color: #333;">
      <div style="width: 100%; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #007BFF;">Email Verification</h1>
          <p>Thank you for signing up! Please click one of the buttons below to verify your email address.</p>
          <p style="text-align: start;">
              <a style="display: inline-block; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-right: 10px;" href="${link}">Verify Email</a>
          </p>
      </div>
    </body>
    
    `;
};
