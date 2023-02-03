"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const infoController_1 = require("./controllers/infoController");
// cron.schedule('*/5 * * * *', uploadData);
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get('/', infoController_1.getInfo);
app.listen(PORT, () => {
    console.log("started");
});
