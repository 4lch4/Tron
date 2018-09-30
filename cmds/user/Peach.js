const Command = require('../BaseCmd')

class Peach extends Command {
  constructor (client) {
    super(client, {
      name: 'peach',
      memberName: 'peach',
      group: 'user',
      description: 'Returns a peach as requested by the lovely peach.',
      aliases: ['peaches'],
      examples: ['+peach']
    })
  }

  async run (msg, args) {
    if (msg.mentions.users.size > 0) {
      msg.mentions.users.forEach(user => {
        user.createDM().then(channel => channel.send('🍑'))
      })

      msg.channel.send('Your message(s) has been sent.')
    } else return msg.channel.send('🍑')
  }
}

module.exports = Peach
