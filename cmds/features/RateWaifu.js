const Command = require('../BaseCmd')

const tools = new (require('../../util/Tools'))()
const ratings = require('../../data/ratings')

class RateWaifu extends Command {
  constructor (client) {
    super(client, {
      name: 'ratewaifu',
      group: 'features',
      memberName: 'ratewaifu',
      guildOnly: true,
      description: 'Rate your waifu! 0 - 10',
      examples: ['+rate @Alcha#0042'],
      aliases: ['rate'],
      args: [{
        key: 'user',
        type: 'user',
        prompt: 'Who did you want to rate?',
        label: 'Waifu'
      }]
    })
  }

  async run (msg, { user }) {
    let info = ratings[user.id]
    if (info !== undefined) {
      if (info.msg === false) {
        return msg.channel.send('**' + user.username + '**, I\'d rate you ' + tools.getRandom(info.min, info.max) + '/10 waifu.')
      } else return msg.channel.send(`**${user.username}**${info.msg}`)
    } else {
      const random = tools.getRandom(0, 11)
      const message = '**' + user.username + "**, I'd rate you " + random + '/10 waifu.'

      return msg.channel.send(message)
    }
  }
}

module.exports = RateWaifu
