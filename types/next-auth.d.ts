import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        role?: string;
        quota?: number;
        model?: string;
        active?: boolean;
        theme?: string;
    }

    interface Session {
        user: User & {
            id: string;
            email: string;
            name?: string;
            image?: string;
            role?: string;
            quota?: number;
            model?: string;
            active?: boolean;
            theme?: string;
        }
    }
} 