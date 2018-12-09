const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Ami extends Command {
  constructor (client) {
    super(client, {
      name: 'ami',
      group: 'user',
      memberName: 'ami',
      description: 'Returns whatever Ami requests.',
      examples: ['+ami']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('ami', args)
    Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Ami
