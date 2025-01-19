import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role: String | null;
    quota: number | 1;
    model: string | "gpt-4o-mini";
  }
}
