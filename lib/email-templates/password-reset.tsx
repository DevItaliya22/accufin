import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  userName: string;
  userEmail: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  userName,
  userEmail,
  resetUrl,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your AccuFin password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <img
            src="https://your-domain.com/image-000.png"
            alt="AccuFin Logo"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Password Reset Request</Heading>
        
        <Text style={text}>
          Hello {userName},
        </Text>
        
        <Text style={text}>
          We received a request to reset your password for your AccuFin account. 
          If you made this request, click the button below to reset your password:
        </Text>
        
        <Section style={buttonContainer}>
          <Link style={button} href={resetUrl}>
            Reset Password
          </Link>
        </Section>
        
        <Text style={text}>
          This link will expire in 1 hour for security reasons.
        </Text>
        
        <Text style={text}>
          If you didn't request a password reset, you can safely ignore this email. 
          Your password will remain unchanged.
        </Text>
        
        <Text style={text}>
          For security reasons, please don't share this link with anyone.
        </Text>
        
        <Text style={text}>
          If the button doesn't work, you can copy and paste this link into your browser:
        </Text>
        
        <Text style={linkText}>
          {resetUrl}
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
          The AccuFin Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  height: "64px",
  width: "auto",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#007399",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const linkText = {
  color: "#007399",
  fontSize: "14px",
  wordBreak: "break-all" as const,
  margin: "16px 0",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0 0",
};
