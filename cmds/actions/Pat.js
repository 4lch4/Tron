const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Pat extends Command {
  constructor (client) {
    super(client, {
      name: 'pat',
      group: 'actions',
      memberName: 'pat',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random pat gif and includes the mentioned users username.',
      examples: ['+pat @Alcha#2621']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you got a pat from **${msg.author.username}**.`
    }

    ioTools.getRandomImage('pat').then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
