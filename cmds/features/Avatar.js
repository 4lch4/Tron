const { Command } = require('discord.js-commando')

class Avatar extends Command {
  constructor (client) {
    super(client, {
      name: 'avatar',
      group: 'features',
      memberName: 'avatar',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a link to the tagged users avatar.',
      details: 'Returns a high quality (if available) version of the tagged users avatar.',
      examples: ['+avatar @Alcha#2621'],
      args: [{
        key: 'user',
        label: 'User',
        prompt: 'Which user did you want the avatar of?',
        type: 'user'
      }]
    })
  }

  async run (msg, { user }) {
    msg.channel.send(user.displayAvatarURL({ size: 2048 }))
  }
}

module.exports = Avatar
