const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class KillMe extends Command {
  constructor (client) {
    super(client, {
      name: 'killme',
      group: 'reactions',
      memberName: 'killme',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random "KillMe" gif.',
      examples: ['+killme']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('killme').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = KillMe
