const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Rekt extends Command {
  constructor (client) {
    super(client, {
      name: 'rekt',
      group: 'reactions',
      memberName: 'rekt',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random rekt gif.',
      examples: ['+rekt']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('rekt').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Rekt
