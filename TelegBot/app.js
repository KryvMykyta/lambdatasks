import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { keyboards } from "./keyboards.js";
import { getMessage } from "./forecasts.js";
import { getUsd, getEur } from "./currencies.js";
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
    let text = await getMessage(3)
    bot.sendMessage(msg.chat.id, text, keyboards.weather);
})

bot.onText(/Every 6 hours/, async (msg) => {
    let text = await getMessage(6)
    bot.sendMessage(msg.chat.id, text, keyboards.weather);
})

bot.onText(/USD/, async (msg) => {
    let text = await getUsd()
    bot.sendMessage(msg.chat.id, text, keyboards.currency);
})

bot.onText(/EUR/, async (msg) => {
    let text = await getEur()
    bot.sendMessage(msg.chat.id, text, keyboards.currency);
})
