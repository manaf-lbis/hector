import { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    image: string;
    description?: string;
    status: 'active' | 'blocked';
}
