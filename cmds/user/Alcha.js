const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Alcha extends Command {
  constructor (client) {
    super(client, {
      name: 'alcha',
      memberName: 'alcha',
      group: 'user',
      description: 'Returns a random image/gif from Alcha\'s folder.',
      aliases: ['alchaholic', 'grampcha'],
      examples: ['+alcha', '+alcha 0']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('alcha', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    })
  }
}

module.exports = Alcha
