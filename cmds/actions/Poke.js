const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Poke extends Command {
  constructor (client) {
    super(client, {
      name: 'poke',
      group: 'actions',
      memberName: 'poke',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random poke gif and includes the mentioned users username.',
      examples: ['+poke @Alcha#2625']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you've been poked by **${msg.author.username}**.`
    }

    ioTools.getRandomImage('poke', args).then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
