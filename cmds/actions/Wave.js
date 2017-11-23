const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Wave extends Command {
  constructor (client) {
    super(client, {
      name: 'wave',
      group: 'actions',
      memberName: 'wave',
      guildOnly: true,
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random wave gif and if a user is mentioned, includes their username.',
      examples: ['+wave @Alcha#2621']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('wave').then(image => {
      msg.channel.send('', {
        files: [
          image
        ]
      })
    })
  }
}
