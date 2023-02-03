import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()


const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

function photo(user){
    axios.get('https://picsum.photos/200/300')
    .then(function (response) {
        const url = response.request.res.responseUrl;
        bot.sendPhoto(user.chat.id,url);
        console.log(JSON.stringify(user.chat.id) + " asked for a photo ");
    });
};

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Bot will answer you with your messages or send random photo when you will send "/photo"')
});

bot.onText(/\/photo/, (msg) =>{
    photo(msg);
});

const commands = ["/photo","/help"]
bot.on("message", function (msg) {
    if (!commands.includes(msg.text)){
        bot.sendMessage(msg.chat.id, 'You sent : '+ JSON.stringify(msg.text));
        console.log(JSON.stringify(msg.from.id) + " sent : " + JSON.stringify(msg.text)); 
    }
});
