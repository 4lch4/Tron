const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Pat extends Command {
  constructor (client) {
    super(client, {
      name: 'pat',
      group: 'actions',
      memberName: 'pat',
      guildOnly: true,
      description: 'Returns a random pat gif and includes the mentioned users username.',
      examples: ['+pat @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you got a pat from **${msg.author.username}**.`
    }

    let image = await ioTools.getRandomImage('pat', args)
    Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
  }
}
