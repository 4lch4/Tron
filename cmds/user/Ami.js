const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

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
    ioTools.getRandomImage('ami', args).then(image => {
      msg.channel.send('', { files: [image] })
    }).catch(err => console.error(err))
  }
}

module.exports = Ami
