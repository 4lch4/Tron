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
      description: 'Returns a random punch gif and includes the mentioned users username.',
      examples: ['+punch @Alcha#0042'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been punched by **${msg.author.username}**. :punch:`
    }

    ioTools.getRandomImage('punch', args).then(image => {
      Command.sendMessage(msg.channel, content, this.client.user, { files: [image] })
    }).catch(err => console.error(err))
  }
}
