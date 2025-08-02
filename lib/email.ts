import transporter from "./nodemailer";
import { render } from "@react-email/components";
import { UserCreatedEmail } from "./email-templates/user-created";
import { LoginConfirmationEmail } from "./email-templates/login-confirmation";
import { ContactFormEmail } from "./email-templates/contact-form";

export interface SendUserCreatedEmailParams {
  userName: string;
  userEmail: string;
  password: string;
  adminName: string;
  loginUrl: string;
}

export interface SendLoginConfirmationEmailParams {
  userName: string;
  userEmail: string;
  loginTime: string;
  loginMethod: string;
}

export interface SendContactFormEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export async function sendUserCreatedEmail({
  userName,
  userEmail,
  password,
  adminName,
  loginUrl,
}: SendUserCreatedEmailParams) {
  try {
    console.log("Email utility - Starting to send email to:", userEmail);
    console.log("Email utility - From email:", process.env.NODEMAILER_EMAIL);

    // Render the React email template to HTML
    const emailHtml = await render(
      UserCreatedEmail({
        userName,
        userEmail,
        password,
        adminName,
        loginUrl,
      })
    );

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userEmail,
      subject: "Welcome to AccuFin - Your Account Has Been Created",
      html: emailHtml,
    };

    console.log("Email utility - Email data prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const result = await transporter.sendMail(mailOptions as any);

    console.log("Email utility - Nodemailer response:", result);
    console.log(`Welcome email sent successfully to ${userEmail}`);
    return { success: true, result };
  } catch (error) {
    console.error("Email utility - Error sending welcome email:", error);
    return { success: false, error };
  }
}

export async function sendContactFormEmail({
  name,
  email,
  subject,
  message,
  submittedAt,
}: SendContactFormEmailParams) {
  try {
    console.log("Email utility - Starting to send contact form email to admin");

    // Render the React email template to HTML
    const emailHtml = await render(
      ContactFormEmail({
        name,
        email,
        subject,
        message,
        submittedAt,
      })
    );

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission - ${subject}`,
      html: emailHtml,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(
      "Email utility - Contact form email sent successfully to admin"
    );
    return { success: true, result };
  } catch (error) {
    console.error("Email utility - Error sending contact form email:", error);
    return { success: false, error };
  }
}

export async function sendLoginConfirmationEmail({
  userName,
  userEmail,
  loginTime,
  loginMethod,
}: SendLoginConfirmationEmailParams) {
  try {
    console.log(
      "Email utility - Starting to send login confirmation email to:",
      userEmail
    );

    // Render the React email template to HTML
    const emailHtml = await render(
      LoginConfirmationEmail({
        userName,
        userEmail,
        loginTime,
        loginMethod,
      })
    );

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userEmail,
      subject: "AccuFin - Login Confirmation",
      html: emailHtml,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(
      "Email utility - Login confirmation email sent successfully to:",
      userEmail
    );
    return { success: true, result };
  } catch (error) {
    console.error(
      "Email utility - Error sending login confirmation email:",
      error
    );
    return { success: false, error };
  }
}
