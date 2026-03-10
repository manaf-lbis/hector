import { IOtp } from "./types";
import { BaseRepository } from "../../shared/base/base.repo";
import { IOtpRepo } from "./interface/otp.repo.interface";
import { OtpModel } from "./models/otp.model";

export class OtpRepo extends BaseRepository<IOtp> implements IOtpRepo  {

    constructor(){
        super(OtpModel)
    }


}