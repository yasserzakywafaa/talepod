import CONFIG from "../config";
import nodeMailer from "nodemailer";

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  /** Defaults to the configured TalePod sender. */
  from?: string;
  attachments?: EmailAttachment[];
}

/** Shared SMTP transporter config (extracted from ContactController so every
 *  mail-sending feature uses one place). */
const createTransporter = () =>
  nodeMailer.createTransport({
    host: CONFIG.SMTP,
    port: parseInt(CONFIG.SMTP_PORT ?? "587"),
    secure: true,
    auth: {
      user: CONFIG.EMAIL,
      pass: CONFIG.PASSWORD,
    },
  });

/** Send one email (text and/or HTML, with optional attachments). */
export const sendEmail = async (options: SendEmailOptions) => {
  const transporter = createTransporter();
  return transporter.sendMail({
    from: options.from || CONFIG.EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  });
};
