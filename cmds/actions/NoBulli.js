const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class NoBulli extends Command {
  constructor (client) {
    super(client, {
      name: 'nobulli',
      group: 'actions',
      memberName: 'nobulli',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Warns @User1 not to bully @User2.',
      examples: ['+nobulli @User1 @User2']
    })
  }

  async run (msg, args) {
    let content = ''

    if (msg.mentions.users.size > 0) {
      const username = msg.mentions.users.first().username
      content = `**${username}**, don't you dare bulli **${msg.author.username}**!`
    }

    ioTools.getRandomImage('nobulli').then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
