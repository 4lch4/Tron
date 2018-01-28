const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Pout extends Command {
  constructor (client) {
    super(client, {
      name: 'pout',
      group: 'reactions',
      memberName: 'pout',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random pout gif.',
      examples: ['+pout']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('pout', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Pout
