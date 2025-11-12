"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = require("../src/database");
beforeAll(async () => {
    console.log("Connecting to test database...");
    await (0, database_1.connectToDatabase)();
});
afterAll(async () => {
    await database_1.client.close();
});
