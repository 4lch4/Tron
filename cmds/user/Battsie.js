const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Battsie extends Command {
  constructor (client) {
    super(client, {
      name: 'battsie',
      group: 'user',
      aliases: ['buttsie', 'batts'],
      memberName: 'battsie',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random image/gif given to me for Battsie.',
      examples: ['+battsie', '+batts', '+buttsie']
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('battsie', args).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Battsie
