const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Foupa extends BaseCmd {
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
    if (msg.author.id === '219270060936527873' || msg.author.id === '159844469464760320') {
      ioTools.getRandomImage('foupa', args).then(image => {
        Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
      })
    } else msg.reply('this command is unavailable to you.')
  }
}

module.exports = Foupa
