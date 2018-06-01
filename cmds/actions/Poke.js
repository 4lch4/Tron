const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class Poke extends Command {
  constructor (client) {
    super(client, {
      name: 'poke',
      group: 'actions',
      memberName: 'poke',
      guildOnly: true,
      description: 'Returns a random poke gif and includes the mentioned users username.',
      examples: ['+poke @Alcha#2625'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      var content = `${this.getMentionedUsernames(msg)}, you've been poked by **${msg.author.username}**.`
    }

    ioTools.getRandomImage('poke', args).then(image => {
      msg.channel.send(content, { files: [image] })
    }).catch(err => console.error(err))
  }
}
