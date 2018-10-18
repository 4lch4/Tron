const config = require('../../util/config.jsonc')

const Coinbase = require('coinbase').Client
const coinbase = new Coinbase({
  'apiKey': config.coinbase.apiKey,
  'apiSecret': config.coinbase.apiSecret,
  'version': '2018-01-17'
})

const currencies = require('../../data/currencies.json')

class CoinbaseAid {
  getCurrentPrice (currency = 'USD') {
    return new Promise((resolve, reject) => {
      coinbase.getSpotPrice({ 'currency': currency }, (err, res) => {
        if (err) reject(err)
        else resolve(res.data.amount)
      })
    })
  }

  getHistoricPrice (date, currency = 'USD') {
    return new Promise((resolve, reject) => {
      coinbase.getSpotPrice({ 'date': date, 'currency': currency }, (err, res) => {
        if (err) reject(err)
        else resolve(res.data.amount)
      })
    })
  }

  /**
   * @returns {Array<String>}
   */
  get currencies () {
    return currencies.data
  }
}

module.exports = CoinbaseAid
