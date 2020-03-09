const TelegramBot = require('node-telegram-bot-api')
const config = require('./src/config')
const handler = require('./src/handlers')
const keyboard = require('./src/keyboards')

const TOKEN = process.env.TELEGRAM_TOKEN||config.TOKEN;
const options = {
    webHook: {
      port: process.env.PORT
    }
  };
const url = process.env.APP_URL || config.heroku_host;
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);



bot.onText(/\/menu/, msg => {
    bot.sendMessage(msg.chat.id, 'klava', {
        reply_markup: {
            keyboard: keyboard.main
        }
    })
})


bot.on('message', msg => {
    switch (msg.text) {
        case 'EXCHANGE RATES':
            bot.sendMessage(msg.chat.id, 'Выберите валюту', {
                reply_markup: {
                    inline_keyboard: keyboard.exchangeRates
                }

            })
            break;

    }

    if (msg.location) {
        async function wrapper() {
            let data = await handler.getWeatherData(msg.location)
            let sunrise = new Date(data.sys.sunrise * 1000)
            let sunset = new Date(data.sys.sunset * 1000)
            function checkMinutes(minutes) {
                return result = minutes < 10 ? "0" + minutes : minutes
            }
            let mk = `
            ***Your location*** (Ваше местоположение): ***${data.name}***
            - Temperature (температура воздуха): ${Math.round(data.main.temp - 273.15)} C
            - Fills like (чувствуется как): ${Math.round(data.main.feels_like - 273.15)} C
            - Humidity (влажность): ${data.main.humidity} %
            - Wind Speed (скорость ветра): ${data.wind.speed} m/s (м/с)
            - Clouds (облачность): ${data.clouds.all} %
            - Sunrise (восход солнца): ${sunrise.getHours()}:${checkMinutes(sunrise.getMinutes())}
            - Sunset (закат): ${sunset.getHours()}:${checkMinutes(sunset.getMinutes())} 
            `

            bot.sendMessage(msg.chat.id, mk, { parse_mode: 'Markdown' })
        }
        wrapper()

    }
})


bot.on('callback_query', query => {
    const id = query.message.chat.id;

    async function wrapper() {
        let result = await handler.getExRate(query.data)
        console.log(result)
        let md = `
         *${result.ccy} => ${result.base_ccy}*
         Buy: __${result.buy}__
         Sale:__${result.sale}__
       `
        bot.sendMessage(id, md, {parse_mode: "Markdown"})

    }
    wrapper()
})