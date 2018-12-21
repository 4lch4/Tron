const Command = require('../BaseCmd')
const { logos, schedule } = require('../util/OWL')

// const tools = new (require('../../util/Tools'))()

class OWL extends Command {
  constructor (client) {
    super(client, {
      name: 'owl',
      group: 'features',
      memberName: 'owl',
      guildOnly: false,
      description: 'Placeholder text.',
      examples: ['+owl', '+owl nsfw']
    })
  }

  async run (msg, { type }) {
    return Command.sendMessage(msg.channel, 'Test', this.client.user, { files: [logos.outlaws.path] })
  }
}

module.exports = OWL
