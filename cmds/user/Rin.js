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
    ioTools.getRandomImage('rin', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    })
  }
}

module.exports = Rin
