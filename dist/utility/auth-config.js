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
        const response = yield axios_1.default.post(`https://dev-nl5xd2r8c23rplbr.us.auth0.com/oauth/token`, {
            client_id: 'DCOJxP7M7IkKpiD6uGMBtFhSnfi7txLH',
            client_secret: 'WKxzlh_WVGSbQ858mKySX1ORC3xLmXvR92EV7XqCR2eO3uWaR_0CrKjAGhvLjWLh',
            audience: 'https://dev-nl5xd2r8c23rplbr.us.auth0.com/api/v2/',
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
