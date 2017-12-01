const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Lewd extends Command {
  constructor (client) {
    super(client, {
      name: 'lewd',
      group: 'reactions',
      memberName: 'lewd',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random lewd face image or gif.',
      examples: ['+lewd']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('lewd').then(image => {
      msg.channel.send('', {
        files: [image]
      })
    })
  }
}

module.exports = Lewd
