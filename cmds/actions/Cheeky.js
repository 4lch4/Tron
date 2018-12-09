const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Cheeky extends Command {
  constructor (client) {
    super(client, {
      name: 'cheeky',
      group: 'actions',
      memberName: 'cheeky',
      guildOnly: true,
      aliases: ['bleh'],
      description: 'Returns a random cheeky gif.',
      examples: ['+cheeky', '+bleh'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    ioTools.getRandomImage('cheeky', args).then(image => {
      Command.sendMessage(msg.channel, '', this.client.user, { files: [image] })
    }).catch(err => console.error(err))
  }
}
