const Command = require('../BaseCmd')
const CommandsDB = require('../../util/db/CommandHelper')

class Stats extends Command {
  constructor (client) {
    super(client, {
      name: 'stats',
      group: 'features',
      memberName: 'stats',
      description: 'Used to display various stats about Tron and the commands executed.',
      examples: ['+stats', '+stats poke'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    const db = new CommandsDB(msg, msg.command)

    try {
      switch (args.length) {
        case 0:
          let usage = await db.getMostUsed()
          return msg.channel.send(usage)

        case 1:
          let count = await db.getUsage(args[0])
          return msg.channel.send(`The **${args[0]}** command has been used a total of **${count}** times.`)

        default:
          break
      }
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Stats
