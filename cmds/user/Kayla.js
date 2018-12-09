const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()
const allowedIds = [
  '142092834260910080',
  '217870035090276374',
  '219270060936527873'
]

class Kayla extends Command {
  constructor (client) {
    super(client, {
      name: 'kayla',
      group: 'user',
      memberName: 'kayla',
      description: 'A command for Kayla/Snow that is only usable by them.',
      examples: ['+kayla']
    })
  }

  async run (msg, args) {
    if (allowedIds.includes(msg.author.id)) {
      let image = await ioTools.getRandomImage('kayla', args)
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    } else msg.reply('This command is unavailable to you.')
  }
}

module.exports = Kayla
