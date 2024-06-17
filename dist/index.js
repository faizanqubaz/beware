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
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routes_1 = require("./routes");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
if (process.env.NODE_ENV === 'production') {
    dotenv_1.default.config({ path: '.env.production' });
}
else {
    dotenv_1.default.config({ path: '.env.development' });
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)());
app.use('/api/v2', routes_1.mainRouter);
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://faizanquba1:wk63Jpi7c16ISRyE@search-apserverdb.mj8x8op.mongodb.net/?retryWrites=true&w=majority&appName=search-apserverDB';
// Dynamic BASE_URL based on NODE_ENV
const BASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_BASE_URL || 'https://mycarcolor-a0030a520142.herokuapp.com/'
    : process.env.DEVELOPMENT_BASE_URL || 'http://localhost:3000';
// CONNECT TO THE MONGODB
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI, {
            ssl: true,
        });
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Base URL: ${BASE_URL}`);
        });
    }
    catch (err) {
        console.error('Failed to connect to DB', err);
    }
});
start();
