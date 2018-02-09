const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Dreamy extends Command {
  constructor (client) {
    super(client, {
      name: 'dreamy',
      group: 'user',
      memberName: 'dreamy',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random cute image/gif given to me by Dreamy.',
      examples: ['+dreamy', '+dreams']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('dreamy', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Dreamy
