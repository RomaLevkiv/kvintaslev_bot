module.exports = {
    main:[
        [
            {
                text: 'WEATHER',                        
                request_location: true
            }
        ],
        [
            {
                text: 'EXCHANGE RATES',
                callback_data: 'exchangeRates'
            }
        ]
    ],
    exchangeRates: [
        [
            {
                text: '€ EUR', 
                callback_data: 'EUR'
            },
            {
                text: '$ USD', 
                callback_data: 'USD'
            },
            {
                text: '₽ RUR', 
                callback_data: 'RUR'
            },
            {
                text: '₿ BTC', 
                callback_data: 'BTC'
            }
        ]
        
    ]
}