import { IUserRepo } from "./interface/user.repository.interface";
import { IUser } from "./types";
import { BaseRepository } from "../../shared/base/base.repo";

export class UserRepo extends BaseRepository<IUser> implements IUserRepo  {


}