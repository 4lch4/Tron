const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Dodge extends Command {
  constructor (client) {
    super(client, {
      name: 'dodge',
      group: 'reactions',
      memberName: 'dodge',
      description: 'Returns a random dodge gif.',
      examples: ['+dodge']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('dodge', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Dodge
