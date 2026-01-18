import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    COACH = 'COACH',
    STUDENT = 'STUDENT',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    // role: UserRole;
    role: UserRole;
    coachingId?: mongoose.Types.ObjectId; // For Students, linking them to a Coach
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.STUDENT,
    },
    coachingId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Temporarily optional until Coach selection flow is added
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'APPROVED', // Default to APPROVED (students), overridden for Coaches in register API
    },
    rejectionReason: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: false,
    }
}, { timestamps: true });

// Prevent Mongoose overwrite warning in development
// Delete the model if it exists to ensure new schema changes are applied during hot reload
if (process.env.NODE_ENV !== 'production' && mongoose.models.User) {
    delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
