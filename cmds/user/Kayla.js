const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()

class Kayla extends Command {
  constructor (client) {
    super(client, {
      name: 'kayla',
      group: 'user',
      memberName: 'kayla',
      throttling: { usages: 1, duration: 10 },
      description: 'A command for Kayla/Snow that is only usable by them.',
      examples: ['+kayla']
    })
  }

  async run (msg, args) {
    if (parseInt(msg.author.id) === 142092834260910080 ||
      parseInt(msg.author.id) === 217870035090276374 ||
      parseInt(msg.author.id) === 219270060936527873) {
      ioTools.getRandomImage('kayla', args).then(img => {
        msg.channel.send('', { files: [img] })
      })
    } else {
      msg.reply('This command is unavailable to you.')
    }
  }
}

module.exports = Kayla
