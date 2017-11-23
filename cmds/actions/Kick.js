const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Kick extends Command {
  constructor (client) {
    super(client, {
      name: 'kick',
      group: 'actions',
      memberName: 'kick',
      guildOnly: true,
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random kick gif and includes the mentioned users username.',
      examples: ['+kick @Alcha#2621']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, you've been kicked by **${msg.author.username}**.`
    }

    ioTools.getRandomImage('kick').then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
