const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Dodge extends Command {
  constructor (client) {
    super(client, {
      name: 'dodge',
      group: 'reactions',
      memberName: 'dodge',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random dodge gif.',
      examples: ['+dodge']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('dodge', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Dodge
