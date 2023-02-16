"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const infoController_1 = require("./controllers/infoController");
const updateDB_1 = require("./dbutils/updateDB");
(0, updateDB_1.createDB)();
(0, updateDB_1.createTable)();
node_cron_1.default.schedule('*/1 * * * *', updateDB_1.uploadData);
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get('/', infoController_1.getInfo);
app.listen(PORT, () => {
    console.log("started");
});
