import { TgBot } from './bot/botInstance';
import dotenv from "dotenv";
import { createTable } from "./migration/createDB";
dotenv.config();
createTable();

const DB_PATH = "usersDb.db"
const TOKEN = String(process.env.TOKEN);
const bot = new TgBot(TOKEN,DB_PATH)
bot.listen()
