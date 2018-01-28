const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Slap extends Command {
  constructor (client) {
    super(client, {
      name: 'slap',
      group: 'actions',
      memberName: 'slap',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random slap gif and includes the mentioned users username.',
      examples: ['+slap @Alcha#2625']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you've been slapped by **${msg.author.username}**. `
    }

    ioTools.getRandomImage('slap', args).then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
