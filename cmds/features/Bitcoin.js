const { Command } = require('discord.js-commando')
const coinbase = new (require('../util/Coinbase'))()

const tools = new (require('../../util/Tools'))()

class Bitcoin extends Command {
  constructor (client) {
    super(client, {
      name: 'bitcoin',
      group: 'features',
      aliases: ['btc'],
      memberName: 'bitcoin',
      throttling: { usages: 1, duration: 10 },
      description: 'Displays current bitcoin prices and allows you to convert the values.',
      examples: ['+bitcoin', '+btc CAD'],
      args: [{
        key: 'currency',
        label: 'currency',
        prompt: 'Which currency would you like to display?',
        type: 'string',
        default: 'USD',
        validate: (val, msg, arg) => {
          if (coinbase.currencies.indexOf(val.toUpperCase()) !== -1) return true
          else return 'you have provided an invalid currency code. Please refer to https://www.currency-iso.org/dam/downloads/lists/list_one.xml for a full list of values.'
        }
      }]
    })
  }

  async run (msg, { currency }) {
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })

    coinbase.getCurrentPrice(currency).then(price => {
      msg.channel.send(`The current price for **1 BTC = ${formatter.format(price)}**.`)
    }).catch(err => {
      msg.reply('there was an unexpected error. Please contact support.')
      console.error(tools.utcTime, err)
    })
  }
}

module.exports = Bitcoin
