const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Zorika extends Command {
  constructor (client) {
    super(client, {
      name: 'zorika',
      group: 'user',
      memberName: 'zorika',
      aliases: ['zori'],
      description: 'Returns a random phrase from Zori.',
      examples: ['+zorika', '+zori']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('zorika', args)
    Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Zorika
