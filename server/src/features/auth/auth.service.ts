import { IUserRepo } from "../user/interface/user.repository.interface";
import { IAuthService } from "./interface/auth.service.interface";


export class AuthService implements IAuthService {
    constructor(
        private _userRepo : IUserRepo
    ){}






}