const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Cheeki extends Command {
  constructor (client) {
    super(client, {
      name: 'cheeki',
      memberName: 'cheeki',
      group: 'user',
      description: 'Returns a random image/gif from Cheeki\'s folder.',
      examples: ['+cheeki', '+cheeki 0']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('cheeki', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Cheeki
