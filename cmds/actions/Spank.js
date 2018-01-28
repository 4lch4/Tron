const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Spank extends Command {
  constructor (client) {
    super(client, {
      name: 'spank',
      group: 'actions',
      memberName: 'spank',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random spank gif and includes the mentioned users username.',
      examples: ['+spank @Alcha#2625']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you've been spanked by **${msg.author.username}**. :wave:`
    }

    ioTools.getRandomImage('spank', args).then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
