import TelegramBot, { KeyboardButton } from "node-telegram-bot-api";
import dotenv from 'dotenv'
import { createTable } from "./migration/createDB";
import { getMessageOfFullData, getMessageOfList } from "./utils/getCryptoData";
import { addLastViewed, addToFavourite, addUserToDb, checkInFavourite, deleteFavourite, deleteLastViewed, sendFavourite, updateLastViewed} from "./utils/dbUtils";
const sqlite3 = require('sqlite3').verbose();
dotenv.config()

createTable()

const hypeCoins = ["BTC", "ETH", "BCH", "XRP", "DOGE"]

const token : string = String(process.env.TOKEN)
console.log("token ", token)

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, async function (msg) {
    addUserToDb(msg.chat.id)
    bot.sendMessage(msg.chat.id, "Greetings traveller, as you can see, I`m the bot that will provide you all the information about crypto you need!\n"+
        "Type /help to understand how I`m working.",{
            reply_markup: {
                inline_keyboard: []
            }
        })
    updateLastViewed(msg.chat.id,"")
});

bot.onText(/\/help/, async function (msg) {
    bot.sendMessage(msg.chat.id, "First of all you can get knowledge of every price for the most popular cryptocurrencies if you type /listRecent\n"+
    "Also you can type /{cryptocurrencySymbol} (e.g. /BTC) to get price of this currency for the last day\n"+
    "Another good feature that you can create your own favourite list of coins typing /addToFavourite {coinName} or /deleteFavourite {coinName} to add or remove coin from this list\n"+
    "And you can get info about last prices of this coins using /listFavourite command.\n"+
    "That`s all you need to know, hope you`ll be fine.")
    updateLastViewed(msg.chat.id,"")
});

bot.onText(/\/listRecent/, async function (msg) {
    bot.sendMessage(msg.chat.id, await getMessageOfList(hypeCoins))
    updateLastViewed(msg.chat.id,"")
});

bot.onText(/\/listFavourite/, async function (msg) {
    const callback = (str: string) => {
        bot.sendMessage(msg.chat.id, str)
    }
    await sendFavourite(msg.chat.id, callback)
    updateLastViewed(msg.chat.id,"")
});

bot.onText(/^\/[a-zA-Z0-9]{2,6}$/, async function (msg) {
    if (msg.text !== "/start" && msg.text !== "/help"){
        updateLastViewed(msg.chat.id, String(msg.text).toUpperCase())
        let coinSymbol = msg.text?.toUpperCase().replace("/","")
        const callback = async (keyboard: any) => {
            bot.sendMessage(msg.chat.id, await getMessageOfFullData(String(coinSymbol)), keyboard)
        }
        await checkInFavourite(msg.chat.id, String(coinSymbol) ,callback, msg.message_id)
    }
});

bot.onText(/^\/addToFavourite [a-zA-Z0-9]{2,6}$/, async function (msg) {
    let coinSymbol = String(msg.text?.split(" ")[1])
    await addToFavourite(msg.chat.id, coinSymbol)
    updateLastViewed(msg.chat.id,"")
});

bot.onText(/^\/deleteFavourite [a-zA-Z0-9]{2,6}$/, async function (msg) {
    let coinSymbol = String(msg.text?.split(" ")[1])
    await deleteFavourite(msg.chat.id, coinSymbol)
    updateLastViewed(msg.chat.id,"")
});

bot.onText(/Add to favourite/, async function (msg) {
    await addLastViewed(msg.chat.id)
    bot.sendMessage(msg.chat.id, "Added")
    updateLastViewed(msg.chat.id,"")
});

bot.onText(/Delete from favourite/, async function (msg) {
    await deleteLastViewed(msg.chat.id)
    bot.sendMessage(msg.chat.id, "Deleted")
    updateLastViewed(msg.chat.id,"")
});
