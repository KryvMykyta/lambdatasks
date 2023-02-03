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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.loadData = void 0;
const mongodb_1 = require("mongodb");
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dep6w4.mongodb.net/?retryWrites=true&w=majority`;
const client = new mongodb_1.MongoClient(uri);
// const data = client.db("jsonbase").collection("data")
function loadData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = req.body;
        const key = req.params.path;
        try {
            yield client.connect();
            const data = client.db("jsonbase").collection("data");
            if ((yield data.findOne({ "path": key })) === null) {
                yield data.insertOne({
                    "path": key,
                    "data": content
                });
                client.close();
                return res.status(200).send("Data was succesfully written");
            }
            else {
                client.close();
                return res.status(400).send("Route already taken");
            }
        }
        catch (err) {
            return res.status(500).send("Server error");
        }
    });
}
exports.loadData = loadData;
function getData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = req.params.path;
        try {
            yield client.connect();
            const data = client.db("jsonbase").collection("data");
            let content = yield data.findOne({ "path": key });
            if (content === null) {
                client.close();
                return res.status(404).send("Data wasnt found");
            }
            else {
                client.close();
                return res.status(200).send(content["data"]);
            }
        }
        catch (err) {
            return res.status(500).send("Server error");
        }
    });
}
exports.getData = getData;
