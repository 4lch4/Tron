const BaseCmd = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class NotWork extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'notwork',
      memberName: 'notwork',
      group: 'reactions',
      description: 'Returns a random not working image/gif.',
      aliases: ['nowork', 'not-work', 'no-work'],
      examples: ['+nowork', '+notwork @Alcha#2625']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('not_working', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = NotWork
