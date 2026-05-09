import nodemailer from "nodemailer";

/**
 * Production-level Send Email Utility
 * Supports HTML templates, attachments, and robust error handling.
 */
const sendEmail = async (options) => {
  const { email, subject, message, html } = options;

  // Validate environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error("❌ SMTP configuration missing in environment variables.");
    return { success: false, error: "SMTP Config Missing" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // Timeout settings for production stability
      connectionTimeout: 10000, 
      greetingTimeout: 5000,
      socketTimeout: 15000,
    });

    const mailOptions = {
      from: `"EduNova Team" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: subject,
      text: message,
      html: html || undefined, // Send HTML if provided
    };

    console.log(`📨 Attempting to send email to: ${email} | Subject: ${subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email Sent Successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Email Sending Failed for ${email}:`, error.message);
    
    // Log more details for debugging in dev
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }

    return { success: false, error: error.message };
  }
};

export default sendEmail;
