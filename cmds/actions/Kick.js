const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Kick extends Command {
  constructor (client) {
    super(client, {
      name: 'kick',
      group: 'actions',
      memberName: 'kick',
      guildOnly: true,
      description: 'Returns a random kick gif and includes the mentioned users username.',
      examples: ['+kick @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been kicked by **${msg.author.username}**.`
      if (msg.mentions.users.find(mention => mention.id === '258162570622533635')) {
        return msg.reply('YOU DARE TRY TO KICK ME?! Who do you think you are?!')
      }
    }

    let image = await ioTools.getRandomImage('kick', args)
    return Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
  }
}
