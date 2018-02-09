const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Kiss extends Command {
  constructor (client) {
    super(client, {
      name: 'kiss',
      group: 'actions',
      memberName: 'kiss',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random kiss gif and includes the mentioned users username.',
      examples: ['+kiss @Alcha#2625']
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.generateUsernames(msg)}, you've been kissed by **${msg.author.username}**. :kiss:`
    }

    ioTools.getRandomImage('kiss', args).then(image => {
      msg.channel.send(content, {
        files: [
          image
        ]
      })
    })
  }
}
