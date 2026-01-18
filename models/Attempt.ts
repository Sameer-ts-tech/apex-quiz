import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttempt extends Document {
    studentId: mongoose.Types.ObjectId;
    quizId: mongoose.Types.ObjectId;
    answers: {
        questionId: mongoose.Types.ObjectId;
        selectedOptionId: string;
    }[];
    score: number;
    completedAt?: Date;
    startedAt: Date;
}

const AttemptSchema: Schema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    answers: [{
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        selectedOptionId: { // We will map this to the _id of the option in the Question document
            type: String,
        },
    }],
    score: {
        type: Number,
        default: 0,
    },
    completedAt: {
        type: Date,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Prevent Mongoose overwrite warning in development
if (process.env.NODE_ENV !== 'production' && mongoose.models.Attempt) {
    delete mongoose.models.Attempt;
}

const Attempt: Model<IAttempt> = mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
