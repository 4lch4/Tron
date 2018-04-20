const BaseCmd = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Dingle extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'dingle',
      memberName: 'dingle',
      group: 'user',
      description: 'Does a dingly thingy.',
      aliases: ['dingleflop', 'dingleberry', 'dingler'],
      examples: ['+dingle']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('dingle', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Dingle
