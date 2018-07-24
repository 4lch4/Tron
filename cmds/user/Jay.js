const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Jay extends Command {
  constructor (client) {
    super(client, {
      name: 'jay',
      group: 'user',
      memberName: 'jay',
      description: 'Returns a jay-like image.',
      examples: ['+jay']
    })
  }

  async run (msg, args) {
    ioTools.getImage('Jay.png').then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Jay
