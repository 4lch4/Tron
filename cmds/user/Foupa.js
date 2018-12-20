const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

const allowedIds = ['159844469464760320', '219270060936527873']

class Foupa extends Command {
  constructor (client) {
    super(client, {
      name: 'foupa',
      memberName: 'foupa',
      group: 'user',
      description: 'A command for Foupa.',
      aliases: ['friendlyneighborhoodpedo'],
      examples: ['+foupa']
    })
  }

  async run (msg, args) {
    if (allowedIds.includes(msg.author.id)) {
      let image = await ioTools.getRandomImage('foupa', args)
      return Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    } else msg.reply('this command is unavailable to you.')
  }
}

module.exports = Foupa
