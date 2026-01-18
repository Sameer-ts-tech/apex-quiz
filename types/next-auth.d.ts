import { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "@/models/User";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            status: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: UserRole;
        status: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        coachingId?: mongoose.Types.ObjectId;
        status: string;
    }
}
