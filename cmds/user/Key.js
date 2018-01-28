const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

class Key extends Command {
  constructor (client) {
    super(client, {
      name: 'key',
      group: 'user',
      memberName: 'key',
      description: 'Returns a random image/gif given to me by Key.',
      examples: ['+key']
    })
  }

  async run (msg, args) {
    if (parseInt(msg.author.id) === 140183864076140544 || parseInt(msg.author.id) === 219270060936527873) {
      ioTools.getRandomImage('key', args).then(image => {
        msg.channel.send('', { files: [image] })
      })
    }
  }
}

module.exports = Key
