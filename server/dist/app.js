"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = __importDefault(require("./shared/middleware/error.middleware"));
const app_route_1 = __importDefault(require("./shared/route/app.route"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_config_1 = require("./shared/configs/db.config");
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, db_config_1.connectDB)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static('uploads'));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use('/api', app_route_1.default);
app.use(error_middleware_1.default);
app.listen(process.env.PORT, () => {
    console.log("Server running on port 3001");
});
