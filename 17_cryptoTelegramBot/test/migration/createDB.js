"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = void 0;
const sqlite3 = require('sqlite3').verbose();
function createTable() {
    const db = new sqlite3.Database(`./../../usersDb.db`);
    db.run("CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY, favourite TEXT, lastViewed TEXT)");
    db.close();
}
exports.createTable = createTable;
