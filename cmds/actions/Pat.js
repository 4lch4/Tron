const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Pat extends Command {
  constructor (client) {
    super(client, {
      name: 'pat',
      group: 'actions',
      memberName: 'pat',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random pat gif and includes the mentioned users username.',
      examples: ['+pat @Alcha#2625'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you got a pat from **${msg.author.username}**.`
    }

    ioTools.getRandomImage('pat', args).then(image => {
      msg.channel.send(content, { files: [image] })
    }).catch(err => console.error(err))
  }
}
