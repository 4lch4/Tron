const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Edgy extends Command {
  constructor (client) {
    super(client, {
      name: 'edgy',
      group: 'reactions',
      memberName: 'edgy',
      aliases: ['edge', '3edgy5me', '2edgy4me', 'edgelord'],
      description: 'Returns a random edgy image/gif.',
      examples: ['+edgy', '+3edgy5me']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('edge', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Edgy
