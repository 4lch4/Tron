const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Punch extends Command {
  constructor (client) {
    super(client, {
      name: 'punch',
      group: 'actions',
      memberName: 'punch',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random punch gif and includes the mentioned users username.',
      examples: ['+punch @Alcha#2621']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you've been punched by **${msg.author.username}**. :punch:`
    }

    ioTools.getRandomImage('punch').then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
