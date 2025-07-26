import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
  Section,
} from "@react-email/components";

interface LoginConfirmationEmailProps {
  userName: string;
  userEmail: string;
  loginTime: string;
  loginMethod: string;
}

export const LoginConfirmationEmail = ({
  userName,
  userEmail,
  loginTime,
  loginMethod,
}: LoginConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>AccuFin</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>Login Confirmation</Text>

            <Text style={text}>Hello {userName},</Text>

            <Text style={text}>
              We're confirming that you have successfully logged into your
              AccuFin account.
            </Text>

            <Text style={text}>
              <strong>Login Details:</strong>
            </Text>

            <Text style={details}>
              Email: {userEmail}
              <br />
              Login Time: {loginTime}
              <br />
              Login Method: {loginMethod}
            </Text>

            <Text style={text}>
              If this was you, no action is required. If you didn't log in to
              your account, please contact our support team immediately.
            </Text>

            <Text style={text}>
              Best regards,
              <br />
              The AccuFin Team
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to {userEmail}. If you didn't expect this
              email, please contact support.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "40px",
};

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0",
};

const content = {
  padding: "0 40px",
};

const title = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px 0",
};

const details = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px 0",
  padding: "12px 16px",
  backgroundColor: "#f3f4f6",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  padding: "0 40px",
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  textAlign: "center" as const,
  margin: "0",
};

export default LoginConfirmationEmail;
