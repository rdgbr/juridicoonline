import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { sendEmail, magicLinkEmail, sendWelcomeEmail, notifyAdminSignup } from "@/lib/mailer";

const hasGoogle = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login",
  },
  providers: [
    // Magic link via Mailgun (custom send)
    Nodemailer({
      // server is required by next-auth shape but we override sendVerificationRequest
      server: { host: "stub", port: 587, auth: { user: "stub", pass: "stub" } },
      from: process.env.MAILGUN_FROM,
      maxAge: 24 * 60 * 60, // 24h
      async sendVerificationRequest({ identifier, url }) {
        const host = new URL(url).host;
        const tpl = magicLinkEmail(url, host, identifier);
        const r = await sendEmail({
          to: identifier,
          subject: tpl.subject,
          html: tpl.html,
          text: tpl.text,
          tags: ["magic-link"],
        });
        if (!r.ok) {
          console.error("[auth] failed to send magic link", r.error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
    ...(hasGoogle
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        (session.user as { id?: string }).id = user.id;
        (session.user as { plan?: string }).plan = (user as { plan?: string }).plan ?? "free";
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // First time a user is created (after first magic-link verify or Google sign-in)
      // 1) Save a Lead record (denormalized — never lost even if user deletes account)
      // 2) Send welcome email to the user
      // 3) Notify admin about the new signup
      try {
        await prisma.lead.create({
          data: {
            email: user.email!,
            name: user.name,
            source: "auth",
          },
        });
      } catch (e) {
        console.error("[auth] could not save lead", e);
      }

      // Send welcome + admin notification in parallel (don't block sign-up)
      Promise.allSettled([
        sendWelcomeEmail(user.email!, user.name),
        notifyAdminSignup({
          email: user.email!,
          name: user.name,
        }),
      ]).catch((e) => console.error("[auth] notification error", e));
    },
    async signIn({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id! },
          data: { lastSeenAt: new Date() },
        });
      } catch {
        /* ignore */
      }
    },
  },
});
