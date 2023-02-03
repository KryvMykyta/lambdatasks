import axios from "axios";

const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=50.450001&lon=30.523333&units=metric&appid=4a27331c96310083697f644cad62c3f5`

// async function getForecast(){
//     let content = await axios.get(URL)
//     content = content.data
//     console.log(content)
// }

// getForecast()

async function getData(URL) {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

function getDayString(str){
    const daysName = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
    let data = new Date("2023-02-03")

    let resStr = daysName[data.getDay()-1] + ", the " + data.getDate() + " of " + monthNames[data.getMonth()]
    return resStr
}

function logWeather(forecasts, period) {
    let resultStr = `Forecast for Kyiv\n`;
    let objects = {};
    for (let i = 0; i < forecasts.length; i++) {
        if (getHours(forecasts[i].dt_txt) % period == 0) {
            let date = forecasts[i].dt_txt.split(" ");
            let hrs = date[1]
            let temperature = Math.round(forecasts[i].main.temp)
            let feels = Math.round(forecasts[i].main.feels_like)
            let weather = forecasts[i].weather[0].main
            if (Object.keys(objects).includes(date[0])) {
                objects[date[0]] += `\t ${hrs}, ${temperature} Celsius, Feels like ${feels} Celsius, ${weather}\n`;
            }
            else {
                objects[date[0]] = `\t ${hrs}, ${temperature} Celsius, Feels like ${feels} Celsius, ${weather}\n`;
            }
        }
    }
    let keys = Object.keys(objects)
    for (let i = 0; i < keys.length; i++) {
        resultStr += getDayString(keys[i]) + "\n";
        resultStr += objects[keys[i]];
    }
    return resultStr;
}

function getHours(str) {
    let hours = str.split(" ");
    hours = hours[1];
    hours = hours.slice(0, 2);
    return Number(hours);
}

export async function getMessage(period) {
    let data = await getData(URL);
    let forecasts = data.list 
    let resultStr = logWeather(forecasts, period);
    return resultStr;
}

