const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Squirtle extends Command {
  constructor (client) {
    super(client, {
      name: 'squirtle',
      group: 'reactions',
      memberName: 'squirtle',
      description: 'Returns a random Squirtle image or gif.',
      examples: ['+squirtle']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('squirtle', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Squirtle
