const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Cry extends Command {
  constructor (client) {
    super(client, {
      name: 'cry',
      group: 'reactions',
      memberName: 'cry',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random cry gif.',
      examples: ['+cry']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('cry').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Cry
