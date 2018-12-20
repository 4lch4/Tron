const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Jay extends Command {
  constructor (client) {
    super(client, {
      name: 'jay',
      group: 'user',
      memberName: 'jay',
      description: 'Returns a jay-like image.',
      examples: ['+jay']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getImage('Jay.png')
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Jay
