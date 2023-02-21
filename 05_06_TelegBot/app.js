import TelegramBot from "node-telegram-bot-api";
import { keyboards } from "./keyboards/keyboards.js";
import { getMessageForecast } from "./utils/forecasts.js";
import { getEurMessage, getUsdMessage } from "./utils/currencies.js";
import dotenv from 'dotenv'
dotenv.config()


const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})
bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome, please, use provided buttons", keyboards.main);
    
})

bot.onText(/Back/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome, please, use provided buttons", keyboards.main);
    
})

bot.onText(/Weather Forecast/, (msg) => {
    bot.sendMessage(msg.chat.id, "Please,choose the interval", keyboards.weather);
})

bot.onText(/Currency exchange/, (msg) => {
    bot.sendMessage(msg.chat.id, "Please,choose the currency", keyboards.currency);
})

bot.onText(/Every 3 hours/, async (msg) => {
    const text = await getMessageForecast(3)
    bot.sendMessage(msg.chat.id, text, keyboards.weather);
})

bot.onText(/Every 6 hours/, async (msg) => {
    const text = await getMessageForecast(6)
    bot.sendMessage(msg.chat.id, text, keyboards.weather);
})

bot.onText(/USD/, async (msg) => {
    const text = await getUsdMessage()
    bot.sendMessage(msg.chat.id, text, keyboards.currency);
})

bot.onText(/EUR/, async (msg) => {
    const text = await getEurMessage()
    bot.sendMessage(msg.chat.id, text, keyboards.currency);
})
