const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Cat extends Command {
  constructor (client) {
    super(client, {
      name: 'cat',
      group: 'reactions',
      memberName: 'cat',
      description: 'Returns a random cat image or gif.',
      examples: ['+cat']
    })
  }

  async run (msg, args) {
    let image = await ioTools.getRandomImage('cats', args)
    return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
  }
}

module.exports = Cat
