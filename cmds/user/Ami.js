const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Ami extends Command {
  constructor (client) {
    super(client, {
      name: 'ami',
      group: 'user',
      memberName: 'ami',
      description: 'Returns whatever Ami requests.',
      examples: ['+ami']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('ami', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    }).catch(err => console.error(err))
  }
}

module.exports = Ami
