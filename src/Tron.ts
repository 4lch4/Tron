import { CommandClient } from 'eris'
import { getCommands, unknown } from './commands'
import { BotConfig, DateFormatter, getClient } from './lib'

const { logDate } = new DateFormatter()

if (process.env.DISCORD_TOKEN) {
  const tron: CommandClient = getClient()

  for (const { execute, label, opts } of getCommands()) {
    tron.registerCommand(label, (msg, args) => execute(msg, args), opts)
  }

  tron.on('ready', () => {
    console.log(`[${logDate}] - Tron has come online!`)
    tron.createMessage(
      BotConfig.homeChannel,
      `[${logDate}] - Tron has come online!`
    )
  })

  tron.on('messageCreate', msg => unknown(tron, msg))
  tron.on('error', (err, id) => {
    console.error('Uncaught error retrieved...')
    console.error(`Error id = ${id}`)
    console.error(err)
  })
  tron.on('warn', (msg, id) => {
    console.warn(`Warning from Tron. Msg id = ${id}`)
    console.warn(msg)
  })
  tron.on('unknown', (packet, id) => {
    console.log(`Unknown event... Id = ${id}`)
    console.log(packet)
  })

  tron.connect()
} else {
  console.error('No DISCORD_TOKEN environment variable was located.')
}
