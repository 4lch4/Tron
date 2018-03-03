const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Bite extends Command {
  constructor (client) {
    super(client, {
      name: 'bite',
      group: 'actions',
      memberName: 'bite',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      aliases: ['bites'],
      description: 'Returns a random bite gif and includes the mentioned users username.',
      examples: ['+bite @Alcha#2625']
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been bitten by **${msg.author.username}**.`
    }

    ioTools.getRandomImage('bite', args).then(image => {
      msg.channel.send(content, { files: [image] })
    })
  }
}
