const { Command } = require('discord.js-commando')

const tools = new (require('../../util/Tools'))()

class RateWaifu extends Command {
  constructor (client) {
    super(client, {
      name: 'ratewaifu',
      group: 'features',
      memberName: 'ratewaifu',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Rate your waifu! 0 - 10',
      examples: ['+rate @Alcha#2621'],
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
    switch (parseInt(user.id)) {
      case 219270060936527873:    // Alcha
        msg.channel.send('**' + user.username + '**-senpai, I\'d rate you 11/10. \n\n_notice me_')
        break
      case 317138587491631104:    // Travis
        msg.channel.send('**' + user.username + '**-dono, I\'d rate you 11/10. :fire:')
        break
      case 158740486352273409:    // Micaww
        msg.channel.send('**' + user.username + "**, I'd rate you 0/10 waifu.")
        break
      case 142092834260910080:    // Snow/Daddy Yoana
        msg.channel.send('**' + user.username + "**, I'd rate you -69/10 waifu.")
        break
      case 146023112008400896:    // Aaron/Mamba
        msg.channel.send('**' + user.username + '**, I\'d rate you 0/10 waifu.')
        break
      case 120797492865400832:    // Bella
        msg.channel.send('**' + user.username + "**, I'd rate you 12/10 waifu. :fire: :fire:")
        break
      case 139474184089632769:    // Utah
        msg.channel.send('**' + user.username + "**, I'd rate you -∞/10 waifu.")
        break
      case 167546638758445056:    // DerpDeSerp
        msg.channel.send('**' + user.username + "**, I'd rate you ∞/10 waifu. The best of the best.")
        break
      case 351967369247326209:    // Heather/Kristina
        msg.channel.send('**' + user.username + "**, I'd rate you " + tools.getRandom(6, 11) + '/10 waifu.')
        break
      case 271499964109029377:    // Daddy Zee
        msg.channel.send('**' + user.username + '**, I\'d rate you ' + tools.getRandom(8, 13) + '/10 waifu.')
        break

      default:
        const random = tools.getRandom(0, 11)
        const message = '**' + user.username + "**, I'd rate you " + random + '/10 waifu.'

        msg.channel.send(message)
        break
    }
  }
}

module.exports = RateWaifu
