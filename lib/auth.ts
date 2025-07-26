import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";
import prisma from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import { sendLoginConfirmationEmail } from "./email";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //login
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            password: true,
          },
        });

        console.log("User in lib/auth.ts file :", user);

        if (!user) {
          throw new Error("No account found with this email");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Send login confirmation email

        return {
          id: user.id,
          email: user.email,
          name: user.name || "",
          isAdmin: user.isAdmin,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      //this is for google sign in
      if (account?.provider === "google") {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
          },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "",
              isAdmin: false,
              password: "",
              provider: "google",
            },
            select: {
              id: true,
              email: true,
              name: true,
              isAdmin: true,
            },
          });
          try {
            const loginTime = new Date().toLocaleString();
            await sendLoginConfirmationEmail({
              userName: user.name || "User",
              userEmail: user.email!,
              loginTime,
              loginMethod: "Google OAuth",
            });
          } catch (emailError) {
            console.error("Error sending login confirmation email:", emailError);
            // Don't fail login if email fails
          }
        }

        user.id = dbUser.id;
        user.isAdmin = dbUser.isAdmin;
        user.name = dbUser.name;
        user.email = dbUser.email;

        // Send login confirmation email for Google login

      }
      return true;
    },
    async jwt({ token, user }) {
      //frontend jwt callback
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.isAdmin = user.isAdmin;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      //session session callback
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
