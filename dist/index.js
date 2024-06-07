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
const user_1 = require("./user");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use('/v2', user_1.mainRouter);
// CONNECT TO THE MONGODB
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect('mongodb://127.0.0.1:27017/todos');
            console.log('Connected to DB');
        }
        catch (err) {
            console.error('Error connecting to DB', err);
        }
    });
}
connectToDB();
app.listen(5000, () => {
    console.log('server is listening on 3000');
});
