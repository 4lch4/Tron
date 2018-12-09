const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Rose extends Command {
  constructor (client) {
    super(client, {
      name: 'rose',
      group: 'user',
      memberName: 'rose',
      aliases: ['prim'],
      description: 'Returns a random image/gif given to me by Rose.',
      examples: ['+rose', '+prim']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('rose', args)
    Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Rose
