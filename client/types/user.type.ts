export interface IUser {
    name :string;
    email : string;
    role :string;
}

export interface AuthState {
    user :IUser | null;
    isAuthenticated : boolean
}