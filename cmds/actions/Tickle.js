const Command = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Tickle extends Command {
  constructor (client) {
    super(client, {
      name: 'tickle',
      memberName: 'tickle',
      group: 'actions',
      description: 'Returns a random tickle image/gif.',
      aliases: ['tickles'],
      examples: ['+tickle @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been tickled by **${msg.author.username}**!`
    }

    let image = await ioTools.getRandomImage('tickle', args)
    return Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
  }
}

module.exports = Tickle
