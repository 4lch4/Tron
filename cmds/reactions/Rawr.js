const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Rawr extends Command {
  constructor (client) {
    super(client, {
      name: 'rawr',
      group: 'reactions',
      memberName: 'rawr',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random rawr gif.',
      examples: ['+rawr']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('rawr', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Rawr
