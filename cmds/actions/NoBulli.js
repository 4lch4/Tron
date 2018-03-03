const Command = require('../BaseCmd')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()

module.exports = class NoBulli extends Command {
  constructor (client) {
    super(client, {
      name: 'nobulli',
      group: 'actions',
      memberName: 'nobulli',
      guildOnly: true,
      throttling: { usages: 1, duration: 10 },
      description: 'Warns @User1 not to bully @User2.',
      examples: ['+nobulli @User1 @User2'],
      args: [{
        key: 'user1',
        type: 'user',
        prompt: 'Which user needs a warning?'
      }, {
        key: 'user2',
        type: 'user',
        prompt: 'Which user needs protecting?'
      }]
    })
  }

  async run (msg, { user1, user2 }) {
    if (msg.mentions.users.size > 1) {
      var content = `**${user1.username}**, don't you dare bulli **${user2.username}**!`
    }

    ioTools.getRandomImage('nobulli').then(image => {
      msg.channel.send(content, { files: [image] })
    }).catch(err => console.error(err))
  }
}
