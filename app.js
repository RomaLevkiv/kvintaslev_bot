const TelegramBot = require('node-telegram-bot-api')
const config = require('./src/config')
const handler = require('./src/handlers')
const keyboard = require('./src/keyboards')
const request = require('request')

const TOKEN = process.env.TELEGRAM_TOKEN||config.TOKEN;
const options = {
    webHook: {
      port: process.env.PORT
    }
  };
  const url = process.env.APP_URL || config.heroku_host;
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);


bot.onText(/\/curs/, (msg, match) => {
    const id = msg.chat.id
    
    bot.sendMessage(id, 'Выберите валюту', {
        reply_markup:{
            inline_keyboard: keyboard.exchangeRates 
        }
         
    })

})

bot.on('callback_query', query => {
    const id = query.message.chat.id;

    request(config.API_PrivatBank, (err, req, body) => {
        const data = JSON.parse(body)
        const result = data.filter(item => item.ccy === query.data)[0]
        let md = `
        *${result.ccy} => ${result.base_ccy}*
        Buy: __${result.buy}__
        Sale:__${result.sale}__
        `
        bot.sendMessage(id, md, {parse_mode: "Markdown"})
    })

    
})

