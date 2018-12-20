const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Battsie extends Command {
  constructor (client) {
    super(client, {
      name: 'battsie',
      group: 'user',
      aliases: ['buttsie', 'batts'],
      memberName: 'battsie',
      description: 'Returns a random image/gif given to me for Battsie.',
      examples: ['+battsie', '+batts', '+buttsie']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('battsie', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Battsie
