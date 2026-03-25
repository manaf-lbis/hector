import { IUserRepo } from "./interface/user.repository.interface";
import { IUser } from "./types";
import { BaseRepository } from "../../shared/base/base.repo";
import { UserModel } from "./models/user.model";

export class UserRepo extends BaseRepository<IUser> implements IUserRepo  {

    constructor(){
        super(UserModel)
    }


}