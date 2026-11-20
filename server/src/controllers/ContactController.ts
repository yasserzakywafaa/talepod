import { NextFunction, Request, Response } from "express";

import { z } from "zod";

import CONFIG from "../config";
import { sendEmail } from "../utils/sendEmail";

/** Visitor fields; the anti-spam fields were already checked by the contact guard. */
const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).email(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export const contactSupport = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const parsed = contactSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { name, email, subject, message } = parsed.data;

  try {
    // Notify the admin of the new submission.
    await sendEmail({
      from: `Yasser from "TalePod" <${CONFIG.EMAIL}>`,
      to: CONFIG.EMAIL ?? "",
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new message from ${name} | (${email}):\n\n${message}`,
    });
    // Send a confirmation email to the user.
    await sendEmail({
      from: `Yasser from "TalePod" <${CONFIG.EMAIL}>`,
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
