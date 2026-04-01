import { Schema, model } from "mongoose";
import { ICategory } from "../types";

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String },
    status: { 
        type: String, 
        enum: ['active', 'blocked'], 
        default: 'active' 
    }
}, { timestamps: true });

export const CategoryModel = model<ICategory>("Category", categorySchema);
