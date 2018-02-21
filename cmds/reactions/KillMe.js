const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class KillMe extends Command {
  constructor (client) {
    super(client, {
      name: 'killme',
      group: 'reactions',
      memberName: 'killme',
      aliases: ['kms'],
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random "KillMe" gif.',
      examples: ['+killme']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('killme', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = KillMe
