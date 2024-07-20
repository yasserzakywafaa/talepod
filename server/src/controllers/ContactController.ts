import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";
import { ContactFormState } from "../models/types";
import nodeMailer from "nodemailer";

export const contactSupport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name, email, subject, message } = request.body as ContactFormState;

  // Configure the transporter for nodemailer
  const transporter = nodeMailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: CONFIG.EMAIL,
      pass: CONFIG.PASSWORD,
    },
  });

  // Mail options for the admin
  const mailOptionsAdmin = {
    from: email,
    to: CONFIG.EMAIL,
    subject: `New Contact Form Submission: ${subject}`,
    text: `You have received a new message from ${name} | (${email}):\n\n${message}`,
  };

  // Mail options for the user
  const mailOptionsUser = {
    from: CONFIG.EMAIL,
    to: email,
    subject: "Thank you for contacting us!",
    text: `Hello ${name},\n\nThank you for reaching out. We have received your message:\n\n${message}\n\nBest regards,\nTalepod`,
  };

  try {
    // Send email to the admin
    await transporter.sendMail(mailOptionsAdmin);
    // Send confirmation email to the user
    await transporter.sendMail(mailOptionsUser);

    console.log("✅ Email sent successfully", {
      request: request.path,
      adminEmail: CONFIG.EMAIL,
      userEmail: email,
    });

    response.status(200).send("✅ Emails sent successfully");
  } catch (error) {
    console.error("❌ Failed to to send email!", {
      error,
    });
    next(`❌ Failed to to send email!${error}`);
  }
};

const ContactController = {
  contactSupport,
};

export default ContactController;
