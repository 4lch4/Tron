import { CommandClient } from 'eris'
import { BotConfig } from './config'

export function getClient(): CommandClient {
  if (BotConfig.token) return new CommandClient(BotConfig.token, undefined, BotConfig.cmdClientOpts)
  else throw new Error('There was no DISCORD_TOKEN environment variable found.')
}
