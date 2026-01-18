import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User, { UserRole } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter an email and password");
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid email or password");
                }

                console.log("Authorize - Full Mongoose User:", JSON.stringify(user.toJSON()));
                console.log("Authorize - User Status Field:", user.status);

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    coachingId: user.coachingId?.toString(),
                    status: user.status, // Pass status
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as any;
                console.log("JWT Callback - User:", u.email, "Role:", u.role, "Status:", u.status);
                token.role = u.role;
                token.id = u.id;
                token.coachingId = u.coachingId;
                token.status = u.status;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as UserRole;
                session.user.id = token.id as string;
                (session.user as any).coachingId = token.coachingId as string;
                (session.user as any).status = token.status as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        // error: '/auth/error',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
