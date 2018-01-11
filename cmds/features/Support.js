const { Command } = require('discord.js-commando')

class Support extends Command {
  constructor (client) {
    super(client, {
      name: 'support',
      group: 'features',
      memberName: 'support',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns information on how to retrieve support for Tron.'
    })
  }

  async run (msg, args) {
    return msg.channel.send('Join the official server for Tron and post a message in the support channel:\n\n' + 'https://discord.gg/dSGH7qB')
  }
}

module.exports = Support
