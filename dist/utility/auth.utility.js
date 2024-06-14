"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromManagementToken = exports.getManagementToken = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getManagementToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const auth0Domain = process.env.MANAGEMENT_AUTH_DOMAIN;
    const clientId = process.env.MANAGEMENT_AUTH_CLIENT_ID;
    const clientSecret = process.env.MANAGEMENT_AUTH_CLIENT_SECRET;
    const audience = process.env.MANAGEMENT_AUDIENCE;
    const tokenEndpoint = `https://${auth0Domain}/oauth/token`;
    const response = yield axios_1.default.post(tokenEndpoint, {
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience,
        grant_type: 'client_credentials',
    }, {
        headers: { 'Content-Type': 'application/json' },
    });
    return response.data.access_token;
});
exports.getManagementToken = getManagementToken;
const getUserFromManagementToken = (accesToken, email) => __awaiter(void 0, void 0, void 0, function* () {
    const userResponse = yield axios_1.default.get(`https://dev-nl5xd2r8c23rplbr.us.auth0.com/api/v2/users-by-email?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${accesToken}` },
    });
    const users = userResponse.data;
    return users;
});
exports.getUserFromManagementToken = getUserFromManagementToken;
