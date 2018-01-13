const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Rose extends Command {
  constructor (client) {
    super(client, {
      name: 'rose',
      group: 'user',
      memberName: 'rose',
      aliases: ['prim'],
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random image/gif given to me by Rose.',
      examples: ['+rose', '+prim']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('rose').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Rose
