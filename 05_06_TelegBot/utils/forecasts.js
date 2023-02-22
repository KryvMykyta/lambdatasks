import axios from "axios";

const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=50.450001&lon=30.523333&units=metric&appid=4a27331c96310083697f644cad62c3f5`;

async function getData(URL) {
  try {
    const { data } = await axios.get(URL);
    return data;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

function getDayString(dateString) {
  const daysName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(dateString);
  const dayName = daysName[date.getDay()];
  const dateNumber = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const dateFormatString = `${dayName}, the ${dateNumber} of ${monthName}`;
  return dateFormatString;
}

function formatForecastsData(forecasts, period) {
  let uniqueDateStrings = [];

  forecasts.forEach((forecast) => {
    const dateString = forecast.dt_txt.split(" ")[0]; // 2023-02-23 09:00:00 => 2023-02-23
    if (!uniqueDateStrings.includes(dateString)) {
      uniqueDateStrings.push(dateString);
    }
  });

  let forecastsPerDate = {};

  uniqueDateStrings.forEach((date) => {
    const currentDateForecasts = forecasts.filter(
      (forecast) => forecast.dt_txt.split(" ")[0] === date
    );
    let dateForecasts = [];
    currentDateForecasts.forEach((forecast) => {
      if (getHoursByDateString(forecast.dt_txt) % period === 0) {
        const time = forecast.dt_txt.split(" ")[1];
        const { temp } = forecast.main;
        const { main: weather } = forecast.weather[0];
        dateForecasts.push({
          time: time,
          temp: temp,
          weather: weather,
        });
      }
    });
    forecastsPerDate[date] = dateForecasts;
  });

  return forecastsPerDate;
}

function logWeather(forecastsData) {
  let messageString = `Forecast for Kyiv\n`;

  const dates = Object.keys(forecastsData);

  dates.forEach((date) => {
    messageString += `${getDayString(date)}\n`;
    const dateHoursData = forecastsData[date];
    dateHoursData.forEach((hourForecast) => {
      const { time, temp, weather } = hourForecast;
      messageString += `\t ${time}, Temperature: ${temp} Celsius, Weather: ${weather}\n`;
    });
  });

  return messageString;
}

function getHoursByDateString(dateString) {
  return new Date(dateString).getHours();
}

export async function getMessageForecast(period) {
  const { list: forecasts } = await getData(URL);
  return logWeather(formatForecastsData(forecasts, period));
}
