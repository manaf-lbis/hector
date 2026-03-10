import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import ApiError from "./api.error";
import { Types } from "mongoose";

export interface TokenPayload {
    userId: Types.ObjectId;
    role?: string;
    email: string;
}

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export const generateTokens = (payload: TokenPayload): Tokens => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
        throw new ApiError("Token generation failed");
    }

    const accessToken = jwt.sign(payload, accessSecret, {
        expiresIn: '1h',
    });

    const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: '7d',

    });

    return { accessToken, refreshToken };
};

export const generateAccessToken = (payload: TokenPayload): string => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    
    if (!accessSecret) throw new ApiError("Token validation failed");
    return jwt.sign(payload, accessSecret, {
        expiresIn: '1h',
    });
};


export const verifyToken = ( token: string, ignoreExpiration = false): TokenPayload | null => {
    try {
        const key = process.env.JWT_ACCESS_SECRET;
        if (!key) throw new ApiError("Token validation failed",500);

        return jwt.verify(token, key, { ignoreExpiration }) as TokenPayload;
    } catch (err) {
        return null;
    }
};
