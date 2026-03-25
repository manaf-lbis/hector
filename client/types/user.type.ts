export interface ILocation {
    lat: number;
    lng: number;
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