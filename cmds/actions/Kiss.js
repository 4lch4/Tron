const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Kiss extends Command {
  constructor (client) {
    super(client, {
      name: 'kiss',
      group: 'actions',
      memberName: 'kiss',
      guildOnly: true,
      description: 'Returns a random kiss gif and includes the mentioned users username.',
      examples: ['+kiss @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been kissed by **${msg.author.username}**. :kiss:`
    }

    let image = await ioTools.getRandomImage('kiss', args)
    Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
  }
}
