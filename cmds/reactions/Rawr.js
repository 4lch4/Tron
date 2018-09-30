const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Rawr extends Command {
  constructor (client) {
    super(client, {
      name: 'rawr',
      group: 'reactions',
      memberName: 'rawr',
      description: 'Returns a random rawr gif.',
      examples: ['+rawr']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('rawr', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    })
  }
}

module.exports = Rawr
