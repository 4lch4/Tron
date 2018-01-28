const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Lick extends Command {
  constructor (client) {
    super(client, {
      name: 'lick',
      group: 'actions',
      memberName: 'lick',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random lick gif and includes the mentioned users username.',
      examples: ['+lick @Alcha#2625']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you've been licked by **${msg.author.username}**. :tongue:`
    }

    ioTools.getRandomImage('lick').then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
