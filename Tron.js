const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')
const tools = new (require('./util/Tools'))()

const config = require('./util/config')

const client = new CommandoClient({
  commandPrefix: config.prefix,
  owner: config.owner,
  disableEveryone: true
})

sqlite.open(path.join(__dirname, 'data', 'settings.sqlite3')).then((db) => {
  client.setProvider(new SQLiteProvider(db))
})

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['actions', 'Action Command Group'],
    ['reactions', 'Reaction Command Group'],
    ['admin', 'Admin Command Group'],
    ['features', 'Feature Commands'],
    ['nsfw', 'NSFW Command Group'],
    ['user', 'User Command Group']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'cmds'))

client.on('ready', () => {
  console.log(`Tron has come online.`)
  client.channels.get(config.notificationChannel).send(`Tron has come online > **${tools.formattedUTCTime}**`)
  client.user.setActivity(config.defaultGame)
})

client.login(config.token)
