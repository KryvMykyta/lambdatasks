import { Command } from "commander";
import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv'
dotenv.config()
const token = process.env.TOKEN
const chatID = process.env.ID
const bot = new TelegramBot(token, {polling: true})

const cmd = new Command()

cmd.command('message')
  .description('sends a string to a telegram bot')
  .argument('<string>', 'text to sent')
  .action( function(str) {
    bot.sendMessage(chatID,str)
  });

cmd.command('image')
  .description('sends an image to a telegram bot')
  .argument('<path>', 'path to an image to sent')
  .action( function(path) {
    bot.sendPhoto(chatID, path)
  });

cmd.parse();