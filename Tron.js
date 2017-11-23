const { CommandoClient } = require('discord.js-commando')
const path = require('path')
const Tools = require('./util/Tools')
const tools = new Tools()

const config = require('./util/config')

const client = new CommandoClient({
  commandPrefix: config.prefix,
  owner: config.owner,
  disableEveryone: true
})

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['actions', 'Action Command Group'],
    ['reactions', 'Reaction Command Group'],
    ['admin', 'Admin Command Group'],
    ['feature', 'Feature Commands'],
    ['nsfw', 'NSFW Command Group'],
    ['user', 'User Command Group']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'cmds'))

client.on('ready', () => {
  console.log(`Tron has come online.`)
  client.channels.get(config.notificationChannel).send(`Tron has come online > **${tools.formattedTime}**`)
  client.user.setActivity(config.defaultGame)
})

client.login(config.token)
