import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from '@/lib/prisma'
import { APIError, createAuthMiddleware } from "better-auth/api";
import { sendEmail } from './email';
import { passwordSchema } from './validation';

// Dynamic configuration based on NODE_ENV
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const getBaseURL = () => {
  if (isDevelopment) {
    return process.env.BETTER_AUTH_URL || "http://localhost:3000";
  }
  if (isProduction) {
    return process.env.BETTER_AUTH_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : "https://parinkasabia.com"; 
  }
  return "http://localhost:3000";
};

const getSecret = () => {
  if (isDevelopment) {
    return process.env.BETTER_AUTH_SECRET || "dev-secret-key-minimum-32-characters-long";
  }
  if (isProduction) {
    if (!process.env.BETTER_AUTH_SECRET) {
      throw new Error("BETTER_AUTH_SECRET must be set in production");
    }
    return process.env.BETTER_AUTH_SECRET;
  }
  return "dev-secret-key-minimum-32-characters-long";
};

const getTrustedOrigins = () => {
  const baseURL = getBaseURL();
  const origins = [baseURL];
  
  if (isDevelopment) {
    origins.push("http://localhost:3000", "http://127.0.0.1:3000");
  }
  
  if (isProduction && process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }
  
  if (process.env.ADDITIONAL_TRUSTED_ORIGINS) {
    origins.push(...process.env.ADDITIONAL_TRUSTED_ORIGINS.split(','));
  }
  
  return origins;
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: getSecret(),
  
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  
  trustedOrigins: getTrustedOrigins(),
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, newEmail, url }) {
        console.log('Sending change email verification to:', newEmail, 'with url:', url);
        await sendEmail({
          to: user.email,
          subject: "Approve email change",
          text: `Your email has been changed to ${newEmail}. Click the link to approve the change: ${url}`,
        });
      },
    },
    additionalFields: { 
      role: { 
        type: 'string',
        input: false
      }
    }
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },
  onAPIError: {
    throw: true,
    onError: (error, ctx) => {
      console.error("Auth error:", error);
    },
    errorURL: "/sign-in",
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;