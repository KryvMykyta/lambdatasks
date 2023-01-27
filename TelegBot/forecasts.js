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

function logWeather(forecasts, period) {
    let resultStr = `Forecast for Kyiv\n`;
    let objects = {};
    for (let i = 0; i < forecasts.length; i++) {
        if (getHours(forecasts[i].dt_txt) % period == 0) {
            let date = forecasts[i].dt_txt.split(" ");
            if (Object.keys(objects).includes(date[0])) {
                objects[date[0]] += `${date[1]}, ${forecasts[i].main.temp} Celsius, Feels like ${forecasts[i].main.feels_like} Celsius, ${forecasts[i].weather[0].main}\n`;
            }
            else {
                objects[date[0]] = `${date[1]}, ${forecasts[i].main.temp} Celsius, Feels like ${forecasts[i].main.feels_like} Celsius, ${forecasts[i].weather[0].main}\n`;
            }
        }
    }
    let keys = Object.keys(objects)
    for (let i = 0; i < keys.length; i++) {
        resultStr += keys[i] + "\n";
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
    let city = data.city.name
    let forecasts = data.list 
    let resultStr = logWeather(forecasts, period);
    return resultStr;
}

