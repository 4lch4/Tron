const Command = require('../BaseCmd')
const owlData = require('../util/OWL')

// const tools = new (require('../../util/Tools'))()

class OWL extends Command {
  constructor (client) {
    super(client, {
      name: 'neko',
      group: 'features',
      memberName: 'neko',
      guildOnly: false,
      description: 'Displays nekos of various shapes and sizes.',
      examples: ['+neko', '+neko nsfw']
    })
  }

  async run (msg, { type }) {
    return msg.reply(owlData.logos.outlaws.path)
  }
}

module.exports = OWL
