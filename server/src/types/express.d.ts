import { Roles } from "../features/user/types";
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface User {
            userId: Types.ObjectId;
            role: Roles;
            email?: string;
            phone?: string;
        }

        interface Request {
            user: User;
        }
    }
}
