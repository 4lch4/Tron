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
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random kick gif and includes the mentioned users username.',
      examples: ['+kick @Alcha#2625']
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been kicked by **${msg.author.username}**.`
    }

    ioTools.getRandomImage('kick', args).then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
