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
        const response = yield axios_1.default.post(`https://dev-42td93pl.us.auth0.com/oauth/token`, {
            client_id: 'NKMsawDXQWOgHxmWUVANEw4IucvPx9K2',
            client_secret: '3AsOYtYa_iu08XyWSNyu3OwUjo4r9VkxEtw0EFR_kfVGPQSKgBjT8l2y_zyVVZ-_',
            audience: 'https://dev-42td93pl.us.auth0.com/api/v2/',
            grant_type: 'client_credentials',
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.access_token;
    }
    catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
});
exports.getAccessToken = getAccessToken;
