const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')
const tools = new (require('./util/Tools'))()
const CommandHelper = require('./util/db/CommandHelper')

const config = require('./util/config')

const GphApiClient = require('giphy-js-sdk-core')
const giphy = GphApiClient(config.giphyKey)

const client = new CommandoClient({
  commandPrefix: config.prefix,
  owner: config.owner,
  disableEveryone: true,
  unknownCommandResponse: false
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
  .registerCommandsIn({
    dirname: path.join(__dirname, 'cmds'),
    excludeDirs: /(util)/
  })

client.on('ready', () => {
  let readyTime = tools.formattedUTCTime

  client.channels.get(config.notificationChannel).send(`Tron has come online > **${readyTime}**`)
  client.user.setActivity(config.defaultGame)

  console.log(`Tron has come online > ${readyTime}`)
})

client.on('commandRun', (cmd, promise, msg) => {
  if (msg.guild !== null) {
    const command = new CommandHelper(msg.guild.id)
    command.incrementUsage(cmd.name).catch(err => console.error(err))
  }
})

client.on('unknownCommand', msg => {
  giphy.search('gifs', {'q': msg.content.substring(1)}).then(res => {
    let random = tools.getRandom(0, res.data.length)
    msg.channel.send(res.data[random].embed_url)
  }).catch(err => console.error(err))
})

client.login(config.token)
