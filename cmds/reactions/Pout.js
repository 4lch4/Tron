const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Pout extends Command {
  constructor (client) {
    super(client, {
      name: 'pout',
      group: 'reactions',
      memberName: 'pout',
      description: 'Returns a random pout gif.',
      examples: ['+pout']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('pout', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Pout
