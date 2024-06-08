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
exports.getAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('sssss', process.env.AUTH0_CLIENT_ID);
        const response = yield axios_1.default.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: 'client_credentials',
        });
        return response.data.access_token;
    }
    catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
});
exports.getAccessToken = getAccessToken;
