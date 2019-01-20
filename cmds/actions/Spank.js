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
      examples: ['+spank @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been spanked by **${msg.author.username}**. :wave:`
      if (msg.mentions.users.find(mention => mention.id === '258162570622533635')) {
        return msg.reply('Oooo... Harder Daddy.')
      }
    }

    let image = await ioTools.getRandomImage('spank', args)
    return Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
  }
}
