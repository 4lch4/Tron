const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Key extends Command {
  constructor (client) {
    super(client, {
      name: 'key',
      group: 'user',
      memberName: 'key',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random image/gif given to me by Key.',
      examples: ['+key']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('key').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Key
