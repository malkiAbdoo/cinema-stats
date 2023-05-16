import { NextAuthOptions } from 'next-auth';
import { db } from '@/utils/db';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';

const env = process.env as Record<string, string>;
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        url: 'https://www.facebook.com/v16.0/dialog/oauth',
        params: { scope: 'public_profile,email' }
      }
    }),
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials: any) {
        if (!credentials) return null;
        const { email, password } = credentials;

        // Check if user exists
        const user = await db.user.findUnique({ where: { email } });
        if (!user) throw new Error(`email:${email} does not exsist!`);

        // Validate password
        const isPasswordValid = await compare(password, user.password!);
        if (!isPasswordValid) throw new Error(`password:Password is not valid!`);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      return token;
    }
  }
};
