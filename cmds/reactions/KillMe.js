const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class KillMe extends Command {
  constructor (client) {
    super(client, {
      name: 'killme',
      group: 'reactions',
      memberName: 'killme',
      aliases: ['kms'],
      description: 'Returns a random "KillMe" gif.',
      examples: ['+killme']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('killme', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    })
  }
}

module.exports = KillMe
