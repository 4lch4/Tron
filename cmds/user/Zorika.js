const Command = require('../BaseCmd')

class Zorika extends Command {
  constructor (client) {
    super(client, {
      name: 'zorika',
      group: 'user',
      memberName: 'zorika',
      aliases: ['zori'],
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random phrase from Zori.',
      examples: ['+zorika', '+zori']
    })
  }

  async run (msg, args) {
    return msg.channel.send('God dammit Jay!')
  }
}

module.exports = Zorika
