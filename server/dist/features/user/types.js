"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.Roles = void 0;
var Roles;
(function (Roles) {
    Roles["user"] = "user";
    Roles["admin"] = "admin";
})(Roles || (exports.Roles = Roles = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["active"] = "active";
    UserStatus["blocked"] = "blocked";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
