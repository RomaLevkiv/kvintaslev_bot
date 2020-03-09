const config = require('./config')
const req_promise = require('request-promise')

function getWeatherData(coords) {
    const lat = coords.latitude
    const lon = coords.longitude
    return req_promise.get(`${config.OpenWeatherLink}?lat=${lat}&lon=${lon}&appid=${config.OpenWeatherAPP_ID}`)
    .then(data =>{
        return JSON.parse(data)
    })
}

function getExRate(typeVal){
   return req_promise.get(config.API_PrivatBank)
    .then(data => {
        let result = JSON.parse(data)
        result = result.filter(item => item.ccy === typeVal)[0]
        return result
    })
    
}

module.exports = {
    getWeatherData: getWeatherData,
    getExRate: getExRate
}