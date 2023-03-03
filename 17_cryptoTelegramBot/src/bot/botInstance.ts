import { standartKeyboardOptions, addKeyboardOptions, deleteKeyboardOptions } from './../keyboards/keyboards';
import { MessageCreator } from "./../utils/messageCreator";
import { UsersRepository } from "./../repository/usersRepository";
import TelegramBot from "node-telegram-bot-api";
const hypeCoins = ["BTC", "ETH", "BCH", "XRP", "DOGE"];
const ERR_MESSAGE =
  "Oops, something went wrong, try make a request later or change your request.";

const startMessage =
  "Greetings traveller, as you can see, I`m the bot that will provide you all the information about crypto you need!\n" +
  "Type /help to understand how I`m working.";

const helpMessage =
  "First of all you can get knowledge of every price for the most popular cryptocurrencies if you type /listRecent\n" +
  "Also you can type /{cryptocurrencySymbol} (e.g. /BTC) to get price of this currency for the last day\n" +
  "Another good feature that you can create your own favourite list of coins typing /addToFavourite {coinName} or /deleteFavourite {coinName} to add or remove coin from this list\n" +
  "And you can get info about last prices of this coins using /listFavourite command.\n" +
  "That`s all you need to know, hope you`ll be fine.";

export class TgBot {
  token: string;
  dbPath: string;
  bot: TelegramBot;
  constructor(token: string, dbPath: string) {
    this.token = token;
    this.dbPath = dbPath;
    this.bot = new TelegramBot(token, { polling: true });
  }

  public listen = () => {
    this.bot.onText(/\/start/, async (msg) => {
      const {
        chat: { id },
      } = msg;
      this.bot.sendMessage(id, startMessage, standartKeyboardOptions());
      const repository = new UsersRepository(this.dbPath);
      repository.createUser(id);
    });

    this.bot.onText(/\/help/, async (msg) => {
      const {
        chat: { id },
      } = msg;
      this.bot.sendMessage(id, helpMessage, standartKeyboardOptions());
    });

    this.bot.onText(/\/listRecent/, async (msg) => {
      const {
        chat: { id },
      } = msg;
      const messageCreator = new MessageCreator();
      const message = await messageCreator.latestForCurrencyList(hypeCoins);
      this.bot.sendMessage(id, message, standartKeyboardOptions());
    });

    this.bot.onText(/\/listFavourite/, async (msg) => {
      const {
        chat: { id },
      } = msg;
      const repository = new UsersRepository(this.dbPath);
      const favourite = repository.getFavouriteById(id).split(",");

      const messageCreator = new MessageCreator();
      const message = await messageCreator.latestForCurrencyList(favourite);

      this.bot.sendMessage(id, message, standartKeyboardOptions());
    });

    this.bot.onText(/^\/[a-zA-Z0-9]{2,6}$/, async (msg) => {
      const {
        text,
        chat: { id },
        message_id,
      } = msg;

      if (text !== "/start" && text !== "/help") {
        const coinSymbol = msg.text?.toUpperCase().replace("/", "");
        if (coinSymbol) {
          const messageCreator = new MessageCreator();
          const message = await messageCreator.currencyOneDayMessage(
            coinSymbol
          );
          const repository = new UsersRepository(this.dbPath);
          repository.updateLastViewedById(id, coinSymbol);
            if (!repository.isInFavourite(id, coinSymbol)){
                this.bot.sendMessage(id, message, addKeyboardOptions(message_id));
            }
            else {
                this.bot.sendMessage(id, message, deleteKeyboardOptions(message_id));
            }
        } else {
          this.bot.sendMessage(id, ERR_MESSAGE, standartKeyboardOptions());
        }
      }
    });

    this.bot.onText(/^\/addToFavourite [a-zA-Z0-9]{2,6}$/, async (msg) => {
      const {
        text,
        chat: { id },
        message_id,
      } = msg;

      const coinSymbol = msg.text?.split(" ")[1];
      if (coinSymbol) {
        const repository = new UsersRepository(this.dbPath);
        repository.addFavouriteById(id, coinSymbol);
        this.bot.sendMessage(id, "Added", standartKeyboardOptions());
      } else {
        this.bot.sendMessage(id, ERR_MESSAGE, standartKeyboardOptions());
      }
    });

    this.bot.onText(/^\/deleteFavourite [a-zA-Z0-9]{2,6}$/, async (msg) => {
      const {
        text,
        chat: { id },
        message_id,
      } = msg;

      const coinSymbol = msg.text?.split(" ")[1];
      if (coinSymbol) {
        const repository = new UsersRepository(this.dbPath);
        repository.deleteFavouriteById(id, coinSymbol);
        this.bot.sendMessage(id, "Deleted", standartKeyboardOptions());
      } else {
        this.bot.sendMessage(id, ERR_MESSAGE, standartKeyboardOptions());
      }
    });

    this.bot.onText(/Add to favourite/, async (msg) => {
      const {
        chat: { id },
      } = msg;
      const repository = new UsersRepository(this.dbPath);
      const lastViewed = repository.getLastViewed(id)
      if(lastViewed) {
        repository.addFavouriteById(id, lastViewed)
        this.bot.sendMessage(id, "Added", standartKeyboardOptions());
      } else {
        this.bot.sendMessage(id, ERR_MESSAGE, standartKeyboardOptions());
      }
    });

    this.bot.onText(/Delete from favourite/, async (msg) => {
      const {
        chat: { id },
      } = msg;
      const repository = new UsersRepository(this.dbPath);
      const lastViewed = repository.getLastViewed(id)
      if(lastViewed) {
        repository.deleteFavouriteById(id, lastViewed)
        this.bot.sendMessage(id, "Deleted", standartKeyboardOptions());
      } else {
        this.bot.sendMessage(id, ERR_MESSAGE, standartKeyboardOptions());
      }
    });
  };
}

// async function main() {
//   const DB_PATH = "../../usersDb.db"
//   const TOKEN = "6011680576:AAHHJYIG7I7KuxMVheQ1ekyg82mfEQt0WY0"
//   const bot = new TgBot(TOKEN,DB_PATH)
//   bot.listen()
// }

// main()