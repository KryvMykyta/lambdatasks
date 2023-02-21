import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()

const IMAGE_REQUEST_URL = 'https://picsum.photos/200/300'
const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, {polling: true});

const getPhotoURL = async () => {
    const {request: {res: {responseUrl : photoUrl}}} = await axios.get(IMAGE_REQUEST_URL)
    return photoUrl
};

bot.onText(/\/help/, (msg) => {
    const {id} = msg.chat
    bot.sendMessage(id, 'Bot will answer you with your messages or send random photo when you will send "/photo"')
});

bot.onText(/\/photo/, async (msg) =>{
    const {chat: {id}} = msg
    bot.sendPhoto(id, await getPhotoURL());
    console.log(`${JSON.stringify(id)} asked for a photo `);
});

const commands = ["/photo","/help"]
bot.on("message", (msg) => {
    const {text, chat: {id}} = msg
    if (!commands.includes(text)){
        bot.sendMessage(id, `You sent : ${JSON.stringify(text)}`);
        console.log(`${JSON.stringify(id)} sent : ${JSON.stringify(text)}`); 
    }
});
