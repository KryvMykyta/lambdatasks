const keyboardMain = {
    "reply_markup": {
        "keyboard": [["Weather Forecast"],   ["Currency exchange"]]
        }
}

const keyboardWeather = {
    "reply_markup": {
        "keyboard": [["Every 3 hours","Every 6 hours"],["Back"]]
        }
}

const keyboardCurrency = {
    "reply_markup": 
        {
        "keyboard": [["USD","EUR"], ["Back"]]
        }
}

export const keyboards = {
    "main": keyboardMain,
    "weather": keyboardWeather,
    "currency": keyboardCurrency
}
