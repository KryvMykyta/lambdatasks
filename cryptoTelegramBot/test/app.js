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
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const createDB_1 = require("./migration/createDB");
const getCryptoData_1 = require("./utils/getCryptoData");
const dbUtils_1 = require("./utils/dbUtils");
const sqlite3 = require('sqlite3').verbose();
dotenv_1.default.config({ path: "../.env" });
(0, createDB_1.createTable)();
const hypeCoins = ["BTC", "ETH", "BCH", "XRP", "DOGE"];
const token = String(process.env.TOKEN);
console.log("token ", token);
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
bot.onText(/\/start/, function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, dbUtils_1.addUserToDb)(msg.chat.id);
        bot.sendMessage(msg.chat.id, "Greetings traveller, as you can see, I`m the bot that will provide you all the information about crypto you need!\n" +
            "Type /help to understand how I`m working.", {
            reply_markup: {
                inline_keyboard: []
            }
        });
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
bot.onText(/\/help/, function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        bot.sendMessage(msg.chat.id, "First of all you can get knowledge of every price for the most popular cryptocurrencies if you type /listRecent\n" +
            "Also you can type /{cryptocurrencySymbol} (e.g. /BTC) to get price of this currency for the last day\n" +
            "Another good feature that you can create your own favourite list of coins typing /addToFavourite {coinName} or /deleteFavourite {coinName} to add or remove coin from this list\n" +
            "And you can get info about last prices of this coins using /listFavourite command.\n" +
            "That`s all you need to know, hope you`ll be fine.");
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
bot.onText(/\/listRecent/, function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        bot.sendMessage(msg.chat.id, yield (0, getCryptoData_1.getMessageOfList)(hypeCoins));
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
bot.onText(/\/listFavourite/, function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const callback = (str) => {
            bot.sendMessage(msg.chat.id, str);
        };
        yield (0, dbUtils_1.sendFavourite)(msg.chat.id, callback);
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
bot.onText(/^\/[a-zA-Z0-9]{2,6}$/, function (msg) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (msg.text !== "/start" && msg.text !== "/help") {
            (0, dbUtils_1.updateLastViewed)(msg.chat.id, String(msg.text).toUpperCase());
            let coinSymbol = (_a = msg.text) === null || _a === void 0 ? void 0 : _a.toUpperCase().replace("/", "");
            const callback = (keyboard) => __awaiter(this, void 0, void 0, function* () {
                bot.sendMessage(msg.chat.id, yield (0, getCryptoData_1.getMessageOfFullData)(String(coinSymbol)), keyboard);
            });
            yield (0, dbUtils_1.checkInFavourite)(msg.chat.id, String(coinSymbol), callback, msg.message_id);
        }
    });
});
bot.onText(/^\/addToFavourite [a-zA-Z0-9]{2,6}$/, function (msg) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let coinSymbol = String((_a = msg.text) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        yield (0, dbUtils_1.addToFavourite)(msg.chat.id, coinSymbol);
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
bot.onText(/^\/deleteFavourite [a-zA-Z0-9]{2,6}$/, function (msg) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let coinSymbol = String((_a = msg.text) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        yield (0, dbUtils_1.deleteFavourite)(msg.chat.id, coinSymbol);
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
bot.onText(/Add to favourite/, function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, dbUtils_1.addLastViewed)(msg.chat.id);
        bot.sendMessage(msg.chat.id, "Added");
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
bot.onText(/Delete from favourite/, function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, dbUtils_1.deleteLastViewed)(msg.chat.id);
        bot.sendMessage(msg.chat.id, "Deleted");
        (0, dbUtils_1.updateLastViewed)(msg.chat.id, "");
    });
});
