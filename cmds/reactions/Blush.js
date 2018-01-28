const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Blush extends Command {
  constructor (client) {
    super(client, {
      name: 'blush',
      group: 'reactions',
      memberName: 'blush',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random blushing gif.',
      examples: ['+blush']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('blush', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Blush
