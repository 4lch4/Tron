const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Honkers extends Command {
  constructor (client) {
    super(client, {
      name: 'honkers',
      memberName: 'honkers',
      group: 'user',
      description: 'Returns a random image/gif from Honkers\'s folder.',
      examples: ['+honkers', '+honkers 0']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('honkers', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Honkers
