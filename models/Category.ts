import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    createdBy: mongoose.Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

// Prevent duplicate categories for the same creator? Or globally?
// Let's assume per-coach for now to avoid conflicts between coaching centers.
CategorySchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
