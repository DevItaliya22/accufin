import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
  Section,
} from "@react-email/components";

interface UserCreatedEmailProps {
  userName: string;
  userEmail: string;
  password: string;
  adminName: string;
  loginUrl: string;
}

export const UserCreatedEmail = ({
  userName,
  userEmail,
  password,
  adminName,
  loginUrl,
}: UserCreatedEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>AccuFin</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>Welcome to AccuFin!</Text>

            <Text style={text}>Hello {userName},</Text>

            <Text style={text}>
              Your account has been successfully created by {adminName}. You can
              now access your AccuFin dashboard and start managing your
              financial documents and forms.
            </Text>

            <Text style={text}>Your login credentials:</Text>

            <Text style={credentials}>Email: {userEmail}</Text>
            <Text style={credentials}>Password: {password}</Text>

            <Text style={text}>
              Please use the password that was provided to you by the
              administrator to log in to your account.
            </Text>

            <Section style={buttonContainer}>
              <Link href={loginUrl} style={button}>
                Login to Your Account
              </Link>
            </Section>

            <Text style={text}>
              If you have any questions or need assistance, please don't
              hesitate to contact our support team.
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

const credentials = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px 0",
  padding: "12px 16px",
  backgroundColor: "#f3f4f6",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
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

export default UserCreatedEmail;
