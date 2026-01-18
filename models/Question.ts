import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
    text: string;
    image?: string; // Optional URL for question image
    type: 'MCQ'; // For now, defaulting to MCQ
    options: {
        text: string;
        image?: string; // Optional URL for option image
        isCorrect: boolean;
    }[];
    categoryId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    defaultScore: number;
    usageCount: number; // For revenue calculation
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
    text: {
        type: String,
        required: [true, 'Please provide question text'],
    },
    image: {
        type: String, // URL to image
        required: false,
    },
    type: {
        type: String,
        enum: ['MCQ'],
        default: 'MCQ',
    },
    options: [{
        text: { type: String, required: true },
        image: { type: String, required: false }, // Option image
        isCorrect: { type: Boolean, required: true, default: false },
    }],
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Coach
        required: true,
    },
    defaultScore: {
        type: Number,
        default: 1,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
