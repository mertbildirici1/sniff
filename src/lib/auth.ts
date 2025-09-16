import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("Authorization attempt started");
          
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials:", { 
              hasEmail: !!credentials?.email, 
              hasPassword: !!credentials?.password 
            });
            return null;
          }

          console.log("Looking up user with email:", credentials.email);
          const user = await db.user.findUnique({
            where: { email: credentials.email as string }
          });

          if (!user) {
            console.log("User not found for email:", credentials.email);
            return null;
          }

          if (!user.password) {
            console.log("User found but no password set for:", user.email);
            return null;
          }

          console.log("User found, verifying password for:", user.email);
          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValidPassword) {
            console.log("Invalid password for user:", user.email);
            return null;
          }

          console.log("User authorized successfully:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            handle: user.handle,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Redirect errors back to signin page
  },
  debug: process.env.NODE_ENV === "development",
});
