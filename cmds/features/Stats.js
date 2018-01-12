const { Command } = require('discord.js-commando')
const Commands = require('../../util/db/Commands')

class Stats extends Command {
  constructor (client) {
    super(client, {
      name: 'stats',
      group: 'features',
      memberName: 'stats',
      throttling: { usages: 1, duration: 10 },
      description: 'Used to display various stats about Tron and the commands executed.',
      examples: ['+stats', '+stats poke'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    const command = new Commands(msg.guild.id)

    switch (args.length) {
      case 0:
        break

      case 1:
        command.getCount(args[0]).then(count => msg.channel.send(count))
          .catch(err => console.error(err))
        break

      default:
        break
    }
  }
}

module.exports = Stats
