import { IUserService } from "../user/interface/user.services.interface";
import { IAuthService } from "./interface/auth.service.interface";


export class AuthService implements IAuthService {
    constructor(
        private _userService : IUserService
    ){}






}