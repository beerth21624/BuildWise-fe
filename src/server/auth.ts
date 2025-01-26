import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type User,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { jwtDecode } from "jwt-decode";
import CredentialsProvider from "next-auth/providers/credentials";

import { type JWT } from "next-auth/jwt";
import { loginService } from "@/services/auth.service";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
  interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    tel: string;
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: (session) => {
      session.session.user = session.token.user;
      return session.session;
    },
    async jwt({ user, token }) {
      if (user) {
        return {
          user: user,
        } as JWT;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "login",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, _) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        const result = await loginService(
          credentials.username,
          credentials.password,
        );

        if (!result?.data.data.access_token) {
          throw new Error("Not found any token or refresh token");
        }

        const decoded = jwtDecode<{ exp: number }>(
          result?.data.data.access_token,
        );

        console.log(decoded);

        const { id, email, first_name, last_name, tel, username } =
          result.data.data.user;

        return {
          exp: decoded.exp,
          id,
          email,
          first_name,
          last_name,
          tel,
          username,
          access_token: result.data.data.access_token,
        };
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
