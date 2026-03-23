"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../../features/auth/auth.route"));
const kyc_route_1 = __importDefault(require("../../features/kyc/kyc.route"));
const user_route_1 = __importDefault(require("../../features/user/user.route"));
const route = (0, express_1.Router)();
route.use('/auth', auth_route_1.default);
route.use('/kyc', kyc_route_1.default);
route.use('/users', user_route_1.default);
exports.default = route;
