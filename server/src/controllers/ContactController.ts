import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";
import { ContactFormState } from "../models/types/story";
import { sendEmail } from "../utils/sendEmail";

export const contactSupport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name, email, subject, message } = request.body as ContactFormState;

  try {
    // Notify the admin of the new submission.
    await sendEmail({
      to: CONFIG.EMAIL ?? "",
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new message from ${name} | (${email}):\n\n${message}`,
    });
    // Send a confirmation email to the user.
    await sendEmail({
      to: email,
      subject: "Thank you for contacting us!",
      text: `Hello ${name},\n\nThank you for reaching out. We have received your message:\n\n${message}\n\nBest regards,\nTalepod`,
    });

    console.log("✅ Email sent successfully", {
      request: request.path,
      adminEmail: CONFIG.EMAIL,
      userEmail: email,
    });

    response.status(200).send("✅ Emails sent successfully");
  } catch (error) {
    console.error("❌ Failed to send email!", {
      error,
    });
    next(`❌ Failed to send email!${error}`);
  }
};

const ContactController = {
  contactSupport,
};

export default ContactController;
