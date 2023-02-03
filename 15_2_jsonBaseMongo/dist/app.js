"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbutils_js_1 = require("./dbutils.js");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.post('/:path', dbutils_js_1.loadData);
app.get('/:path', dbutils_js_1.getData);
app.listen(PORT, () => {
    console.log("started");
});
