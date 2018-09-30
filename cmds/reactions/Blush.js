const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Blush extends Command {
  constructor (client) {
    super(client, {
      name: 'blush',
      group: 'reactions',
      memberName: 'blush',
      description: 'Returns a random blushing gif.',
      examples: ['+blush']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('blush', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    })
  }
}

module.exports = Blush
