const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Dreamy extends Command {
  constructor (client) {
    super(client, {
      name: 'dreamy',
      group: 'user',
      memberName: 'dreamy',
      description: 'Returns a random cute image/gif given to me by Dreamy.',
      examples: ['+dreamy', '+dreams']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('dreamy', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    })
  }
}

module.exports = Dreamy
