const TelegramBot = require('node-telegram-bot-api')
const config = require('./src/config')
const handler = require('./src/handlers')
const keyboard = require('./src/keyboards')
const request = require('request')

const TOKEN = config.TOKEN;
// const options = {
//     webHook: {
//       port: process.env.PORT
//     }
//   };
  //const url = process.env.APP_URL || 'https://safe-sands-47012.herokuapp.com:443';
//const bot = new TelegramBot(TOKEN, options);

//bot.setWebHook(`${url}/bot${TOKEN}`);

  const bot = new TelegramBot(TOKEN, {
    polling: true
})

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

