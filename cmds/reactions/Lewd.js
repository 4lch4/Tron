const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Lewd extends Command {
  constructor (client) {
    super(client, {
      name: 'lewd',
      group: 'reactions',
      memberName: 'lewd',
      description: 'Returns a random lewd face image or gif.',
      examples: ['+lewd']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('lewd', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Lewd
