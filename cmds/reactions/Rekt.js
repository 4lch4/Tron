const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Rekt extends Command {
  constructor (client) {
    super(client, {
      name: 'rekt',
      group: 'reactions',
      memberName: 'rekt',
      description: 'Returns a random rekt gif.',
      examples: ['+rekt']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('rekt', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Rekt
