const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Punch extends Command {
  constructor (client) {
    super(client, {
      name: 'punch',
      group: 'actions',
      memberName: 'punch',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random punch gif and includes the mentioned users username.',
      examples: ['+punch @Alcha#2625']
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been punched by **${msg.author.username}**. :punch:`
    }

    ioTools.getRandomImage('punch', args).then(image => {
      msg.channel.send(content, { files: [image] })
    })
  }
}
