const { Command } = require('discord.js-commando')

class Invite extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      group: 'features',
      memberName: 'invite',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns an invite link to add Tron to your server.',
      examples: ['+invite']
    })
  }

  async run (msg, args) {
    msg.reply('would you like me to join your server? :smiley:\nhttps://discordapp.com/oauth2/authorize?client_id=258162570622533635&scope=bot')
  }
}

module.exports = Invite
