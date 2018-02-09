const Command = require('../BaseCmd')

class Ami extends Command {
  constructor (client) {
    super(client, {
      name: 'ami',
      group: 'user',
      memberName: 'ami',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns whatever Ami requests.',
      examples: ['+ami']
    })
  }

  async run (msg, args) {
    return msg.channel.send('𝓽𝓱𝓮 𝓲𝓶𝓹𝓾𝓻𝓮 𝓱𝓮𝓷𝓽𝓪𝓲 𝓺𝓾𝓮𝓮𝓷')
  }
}

module.exports = Ami
