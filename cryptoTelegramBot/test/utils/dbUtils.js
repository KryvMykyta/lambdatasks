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
exports.updateLastViewed = exports.addUserToDb = exports.deleteFavourite = exports.deleteLastViewed = exports.addLastViewed = exports.checkInFavourite = exports.addToFavourite = exports.sendFavourite = void 0;
const getCryptoData_1 = require("./getCryptoData");
const sqlite3 = require('sqlite3').verbose();
function sendFavourite(id, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `SELECT * FROM users WHERE userId = ${id}`;
        const db = new sqlite3.Database(`./../../usersDb.db`);
        yield db.get(sql, (err, row) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            if (String(row.favourite) === "") {
                callback("You have empty list of favourites");
                return 0;
            }
            let data = yield (0, getCryptoData_1.getMessageOfList)(String(row.favourite).split(","));
            callback(data);
        }));
        db.close();
    });
}
exports.sendFavourite = sendFavourite;
function addToFavourite(id, coinSymbol) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `SELECT * FROM users WHERE userId = ${id}`;
        const db = new sqlite3.Database(`./../../usersDb.db`);
        yield db.get(sql, (err, row) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            if (String(row.favourite) === "") {
                yield db.run(`UPDATE users SET favourite = "${coinSymbol}" WHERE userId = ${id}`);
                return 0;
            }
            let favourite = String(row.favourite).split(",");
            if (!favourite.includes(coinSymbol)) {
                favourite.push(coinSymbol);
            }
            let newFavourite = favourite.join(",");
            yield db.run(`UPDATE users SET favourite = "${newFavourite}" WHERE userId = ${id}`);
        }));
        db.close();
    });
}
exports.addToFavourite = addToFavourite;
function checkInFavourite(id, coinSymbol, callback, msgid) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `SELECT * FROM users WHERE userId = ${id}`;
        const db = new sqlite3.Database(`./../../usersDb.db`);
        yield db.get(sql, (err, row) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            let favourite = String(row.favourite).split(",");
            let exists = favourite.includes(coinSymbol);
            console.log("ok");
            if (exists) {
                callback({
                    reply_to_message_id: msgid,
                    reply_markup: {
                        resize_keyboard: true,
                        one_time_keyboard: true,
                        remove_keyboard: true,
                        keyboard: [
                            [{ text: 'Delete from favourite' }],
                        ],
                    }
                });
            }
            else {
                callback({
                    reply_to_message_id: msgid,
                    reply_markup: {
                        resize_keyboard: true,
                        one_time_keyboard: true,
                        remove_keyboard: true,
                        keyboard: [
                            [{ text: 'Add to favourite' }],
                        ],
                    }
                });
            }
        }));
        db.close();
    });
}
exports.checkInFavourite = checkInFavourite;
function addLastViewed(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `SELECT * FROM users WHERE userId = ${id}`;
        const db = new sqlite3.Database(`./../../usersDb.db`);
        yield db.get(sql, (err, row) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            let lastViewed = String(row.lastViewed);
            if (lastViewed.length > 2 && lastViewed.length < 6) {
                yield addToFavourite(id, lastViewed);
            }
        }));
        db.close();
    });
}
exports.addLastViewed = addLastViewed;
function deleteLastViewed(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `SELECT * FROM users WHERE userId = ${id}`;
        const db = new sqlite3.Database(`./../../usersDb.db`);
        yield db.get(sql, (err, row) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            let lastViewed = String(row.lastViewed);
            yield deleteFavourite(id, lastViewed);
        }));
        db.close();
    });
}
exports.deleteLastViewed = deleteLastViewed;
function deleteFavourite(id, coinSymbol) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `SELECT * FROM users WHERE userId = ${id}`;
        const db = new sqlite3.Database(`./../../usersDb.db`);
        yield db.get(sql, (err, row) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            let favourite = String(row.favourite).split(",");
            if (favourite.includes(coinSymbol)) {
                let index = favourite.indexOf(coinSymbol);
                if (index !== -1) {
                    favourite.splice(index, 1);
                }
            }
            let newFavourite = favourite.join(",");
            yield db.run(`UPDATE users SET favourite = "${newFavourite}" WHERE userId = ${id}`);
        }));
        db.close();
    });
}
exports.deleteFavourite = deleteFavourite;
function addUserToDb(id) {
    const hypeCoins = ["BTC", "ETH", "BCH", "XRP", "DOGE"];
    const hypeCoinsString = hypeCoins.join(",");
    let sql = `INSERT OR IGNORE INTO users (userId, favourite, lastViewed) VALUES (${id}, "", "")`;
    const db = new sqlite3.Database(`./../../usersDb.db`);
    db.run(sql, [], (err, row) => {
        if (err) {
            console.log(err);
        }
    });
    db.close();
}
exports.addUserToDb = addUserToDb;
function updateLastViewed(id, lastViewed) {
    let sql = `UPDATE users SET lastViewed = "${lastViewed.replace("/", "")}" WHERE userId = ${id}`;
    const db = new sqlite3.Database(`./../../usersDb.db`);
    db.run(sql, [], (err, row) => {
        if (err) {
            console.log(err);
        }
    });
    db.close();
}
exports.updateLastViewed = updateLastViewed;
