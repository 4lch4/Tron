const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Kill extends Command {
  constructor (client) {
    super(client, {
      name: 'kill',
      group: 'actions',
      memberName: 'kill',
      guildOnly: true,
      description: 'Returns a random kill gif and includes the mentioned users username.',
      examples: ['+kill @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been killed by **${msg.author.username}**. :knife:`
    }

    let image = await ioTools.getRandomImage('kill', args)
    return Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
  }
}
