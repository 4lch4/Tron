const BaseCmd = require('../BaseCmd')
const ioTools = new (require('../../util/IOTools'))()

class Tickle extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'tickle',
      memberName: 'tickle',
      group: 'actions',
      description: 'Returns a random tickle image/gif.',
      aliases: ['tickles'],
      examples: ['+tickle @Alcha#2625'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been tickled by **${msg.author.username}**!`
    }

    ioTools.getRandomImage('tickle', args).then(image => {
      msg.channel.send(content, { files: [image] })
    }).catch(err => console.error(err))
  }
}

module.exports = Tickle
