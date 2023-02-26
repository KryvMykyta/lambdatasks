import TelegramBot, { KeyboardButton } from "node-telegram-bot-api";
import dotenv from "dotenv";
import { createTable } from "./migration/createDB";
import { getMessageOfFullData, getMessageOfCoinsList } from "./utils/getCryptoData";
import {
  addLastViewed,
  addToFavourite,
  addUserToDb,
  checkInFavourite,
  deleteFavourite,
  deleteLastViewed,
  sendFavourite,
  updateLastViewed,
} from "./utils/dbUtils";
dotenv.config();

createTable();

const token: string = String(process.env.TOKEN);

const bot = new TelegramBot(token, { polling: true });

const hypeCoins = ["BTC", "ETH", "BCH", "XRP", "DOGE"];

const startMessage =
  "Greetings traveller, as you can see, I`m the bot that will provide you all the information about crypto you need!\n" +
  "Type /help to understand how I`m working.";

const helpMessage =
  "First of all you can get knowledge of every price for the most popular cryptocurrencies if you type /listRecent\n" +
  "Also you can type /{cryptocurrencySymbol} (e.g. /BTC) to get price of this currency for the last day\n" +
  "Another good feature that you can create your own favourite list of coins typing /addToFavourite {coinName} or /deleteFavourite {coinName} to add or remove coin from this list\n" +
  "And you can get info about last prices of this coins using /listFavourite command.\n" +
  "That`s all you need to know, hope you`ll be fine.";

bot.onText(/\/start/, async function (msg) {
  const {
    chat: { id },
  } = msg;
  addUserToDb(id);
  bot.sendMessage(id, startMessage, {
    reply_markup: {
      inline_keyboard: [],
    },
  });
  updateLastViewed(id, "");
});

bot.onText(/\/help/, async function (msg) {
  const {
    chat: { id },
  } = msg;
  bot.sendMessage(id, helpMessage);
  updateLastViewed(id, "");
});

bot.onText(/\/listRecent/, async function (msg) {
  const {
    chat: { id },
  } = msg;
  bot.sendMessage(id, await getMessageOfCoinsList(hypeCoins));
  updateLastViewed(id, "");
});

bot.onText(/\/listFavourite/, async function (msg) {
  const {
    chat: { id },
  } = msg;
  const callback = (str: string) => {
    bot.sendMessage(id, str);
  };
  await sendFavourite(id, callback);
  updateLastViewed(id, "");
});

bot.onText(/^\/[a-zA-Z0-9]{2,6}$/, async function (msg) {
  const {
    text,
    chat: { id },
    message_id,
  } = msg;
  if (text !== "/start" && text !== "/help") {
    updateLastViewed(id, String(text).toUpperCase());
    const coinSymbol = msg.text?.toUpperCase().replace("/", "");
    const messageSend = async (keyboard: any) => {
      bot.sendMessage(
        id,
        await getMessageOfFullData(String(coinSymbol)),
        keyboard
      );
    };
    await checkInFavourite(id, String(coinSymbol), messageSend, message_id);
  }
});

bot.onText(/^\/addToFavourite [a-zA-Z0-9]{2,6}$/, async function (msg) {
  const coinSymbol = String(msg.text?.split(" ")[1]);
  await addToFavourite(msg.chat.id, coinSymbol);
  updateLastViewed(msg.chat.id, "");
});

bot.onText(/^\/deleteFavourite [a-zA-Z0-9]{2,6}$/, async function (msg) {
  const {
    text,
    chat: { id },
  } = msg;
  const coinSymbol = String(text?.split(" ")[1]);
  await deleteFavourite(id, coinSymbol);
  updateLastViewed(id, "");
});

bot.onText(/Add to favourite/, async function (msg) {
  const {
    chat: { id },
  } = msg;
  await addLastViewed(id);
  bot.sendMessage(id, "Added");
  updateLastViewed(id, "");
});

bot.onText(/Delete from favourite/, async function (msg) {
  const {
    chat: { id },
  } = msg;
  await deleteLastViewed(id);
  bot.sendMessage(id, "Deleted");
  updateLastViewed(id, "");
});
