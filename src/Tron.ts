import { CommandClient } from 'eris'
import { unknown, getCommands } from './commands'
import { getClient } from './util'

if (process.env.DISCORD_TOKEN) {
  const tron: CommandClient = getClient()
  // const { execute, label, opts } = new Ping()

  for (const { execute, label, opts } of getCommands()) {
    tron.registerCommand(label, (msg, args) => execute(msg, args), opts)
  }

  // tron.registerCommand(
  //   'ping',
  //   (_msg, _args) => {
  //     return 'Pong!'
  //   },
  //   {
  //     aliases: ['pang'],
  //     caseInsensitive: true
  //   }
  // )

  tron.on('ready', () => {
    console.log('Ready!')
  })

  tron.on('messageCreate', msg => unknown(tron, msg))

  tron.connect()
} else {
  console.error('No DISCORD_TOKEN environment variable was located.')
}
