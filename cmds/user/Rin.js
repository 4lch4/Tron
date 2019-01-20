const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Rin extends Command {
  constructor (client) {
    super(client, {
      name: 'rin',
      memberName: 'rin',
      group: 'user',
      description: 'Returns a random image/gif from Rin\'s folder.',
      examples: ['+rin', '+rin 0']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('rin', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Rin
