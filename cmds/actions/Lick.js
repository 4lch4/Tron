const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Lick extends Command {
  constructor (client) {
    super(client, {
      name: 'lick',
      group: 'actions',
      memberName: 'lick',
      guildOnly: true,
      description: 'Returns a random lick gif and includes the mentioned users username.',
      examples: ['+lick @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been licked by **${msg.author.username}**. :tongue:`
    }

    let image = await ioTools.getRandomImage('lick', args)
    return Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
  }
}
