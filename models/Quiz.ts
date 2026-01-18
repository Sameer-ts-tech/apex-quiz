import mongoose, { Schema, Document, Model } from 'mongoose';

export enum QuizMode {
    RANDOM = 'RANDOM',
    MANUAL = 'MANUAL',
}

export interface IQuiz extends Document {
    title: string;
    description?: string;
    createdBy: mongoose.Types.ObjectId;
    mode: QuizMode;
    questions: {
        questionId: mongoose.Types.ObjectId;
        score: number;
    }[];
    duration: number; // in minutes
    totalMarks: number;
    isActive: boolean;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const QuizSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a quiz title'],
    },
    description: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Coach
        required: true,
    },
    mode: {
        type: String,
        enum: Object.values(QuizMode),
        required: true,
    },
    questions: [{
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
    }],
    duration: {
        type: Number, // Minutes
        default: 60,
    },
    totalMarks: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Prevent Mongoose overwrite warning in development
if (process.env.NODE_ENV !== 'production' && mongoose.models.Quiz) {
    delete mongoose.models.Quiz;
}

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz;
