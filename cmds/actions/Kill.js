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
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random kill gif and includes the mentioned users username.',
      examples: ['+kill @Alcha#2625']
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been killed by **${msg.author.username}**. :knife:`
    }

    ioTools.getRandomImage('kill', args).then(image => {
      msg.channel.send(content, { files: [image] })
    })
  }
}
