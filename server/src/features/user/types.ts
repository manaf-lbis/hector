import { Document, Types } from "mongoose";

export enum Roles {
    user = 'user',
    admin = 'admin'
} 

export enum UserStatus {
    active = 'active',
    blocked = 'blocked'
}

export interface ILocation {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    city?: string;
    state?: string;
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone :string;
    role : Roles;
    status: UserStatus;
    refreshToken?: string;
    location?: ILocation;
    kyc:Types.ObjectId;
    customId: string;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}