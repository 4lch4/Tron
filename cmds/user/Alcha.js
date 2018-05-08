const BaseCmd = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Alcha extends BaseCmd {
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
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Alcha
