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

                if (!user) {
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
                console.log("JWT Callback - User:", user.email, "Role:", user.role, "Status:", user.status);
                token.role = user.role;
                token.id = user.id;
                token.coachingId = user.coachingId;
                token.status = user.status;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as UserRole;
                session.user.id = token.id as string;
                session.user.coachingId = token.coachingId as string;
                session.user.status = token.status as string;
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
