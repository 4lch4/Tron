const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Confused extends Command {
  constructor (client) {
    super(client, {
      name: 'confused',
      group: 'reactions',
      memberName: 'confused',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random confused gif.',
      examples: ['+confused']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('confused').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Confused
