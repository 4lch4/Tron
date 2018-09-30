const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Spank extends Command {
  constructor (client) {
    super(client, {
      name: 'spank',
      group: 'actions',
      memberName: 'spank',
      guildOnly: true,
      description: 'Returns a random spank gif and includes the mentioned users username.',
      examples: ['+spank @Alcha#2625'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been spanked by **${msg.author.username}**. :wave:`
    }

    ioTools.getRandomImage('spank', args).then(image => {
      Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
    }).catch(err => console.error(err))
  }
}
