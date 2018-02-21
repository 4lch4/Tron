const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Dance extends Command {
  constructor (client) {
    super(client, {
      name: 'dance',
      group: 'reactions',
      memberName: 'dance',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random dancing gif.',
      examples: ['+dance']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('dance', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Dance
