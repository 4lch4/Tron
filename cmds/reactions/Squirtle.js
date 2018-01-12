const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Squirtle extends Command {
  constructor (client) {
    super(client, {
      name: 'squirtle',
      group: 'reactions',
      memberName: 'squirtle',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random Squirtle image or gif.',
      examples: ['+squirtle']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('squirtle').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Squirtle
