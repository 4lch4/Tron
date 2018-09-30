const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Cry extends Command {
  constructor (client) {
    super(client, {
      name: 'cry',
      group: 'reactions',
      memberName: 'cry',

      description: 'Returns a random cry gif.',
      examples: ['+cry']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('cry', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    })
  }
}

module.exports = Cry
