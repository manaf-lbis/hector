import { NextFunction, Request, Response } from "express";
import { IAuthService } from "./interface/auth.service.interface";

export class AuthController {
    constructor(
        private _authService: IAuthService
    ) { }


    async login(req: Request, res: Response, next: NextFunction) {
        try {
            

        } catch (error) {


        }

    }
} 