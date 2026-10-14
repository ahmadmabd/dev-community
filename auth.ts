import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub,
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.email().transform((value) => value.toLowerCase()),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        await connectDB();

        const user = await User.findOne({ email }).select("+passwordHash");

        if (!user?.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      // Credentials users are already verified in authorize().
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user.email) return false;

      await connectDB();

      await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            name: user.name || user.email.split("@")[0],
            image: user.image ?? "",
          },
          $setOnInsert: {
            email: user.email,
          },
        },
        { upsert: true },
      );

      return true;
    },
  },

  pages: {
    signIn: "/login",
  },
});
