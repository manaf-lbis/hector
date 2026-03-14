"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const base_repo_1 = require("../../shared/base/base.repo");
const user_modal_1 = require("./models/user.modal");
class UserRepo extends base_repo_1.BaseRepository {
    constructor() {
        super(user_modal_1.UserModel);
    }
}
exports.UserRepo = UserRepo;
