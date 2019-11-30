const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Bannan extends Command {
  constructor (client) {
    super(client, {
      name: 'bannan',
      group: 'reactions',
      memberName: 'bannan',
      description: 'Returns a random Bannan image or gif.',
      examples: ['+Bannan']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('bannan', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Cat
