export interface ILocation {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    city?: string;
    state?: string;
}

export interface IUser {
    name: string;
    email: string;
    role: string;
    location?: ILocation;
    kycStatus?: string;
    kycData?: {
        profilePicture?: string;
        [key: string]: any;
    };
}

export interface AuthState {
    user :IUser | null;
    isAuthenticated : boolean
}