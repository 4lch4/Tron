const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Kill extends Command {
  constructor (client) {
    super(client, {
      name: 'kill',
      group: 'actions',
      memberName: 'kill',
      guildOnly: true,
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random kill gif and includes the mentioned users username.',
      examples: ['+kill @Alcha#2621']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you've been killed by **${msg.author.username}**. :knife:`
    }

    ioTools.getRandomImage('kill').then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
