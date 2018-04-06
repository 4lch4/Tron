const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')
const tools = new (require('./util/Tools'))()
const CommandHelper = require('./util/db/CommandHelper')

const config = require('./util/config.json')
const logger = new (require('./util/logger'))()

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

  /**
   * Rotates the activity setting on Tron every 2 minutes (120,000ms) to a
   * random value  in config.activities. Ideally, I'd like to add information
   * such as  current number of guilds/users we support and add it to the list
   * of "activities" as well.
   *
   * When an update occurs, it is logged in the info log.
   */
  setInterval(function () {
    let activities = config.activities
    let random = tools.getRandom(0, activities.length)
    let activity = activities[random]

    logger.log(`Updating activity to ${activity}`, false)

    client.user.setActivity(activity)
  }, 120000)

  logger.log(`Tron has come online > ${readyTime}`)
})

client.on('commandRun', (cmd, promise, msg) => {
  logger.log(`Running ${cmd.name}...`)

  if (msg.guild !== null) {
    const command = new CommandHelper(msg.guild.id)
    command.incrementUsage(cmd.name).catch(err => logger.error(err))
  }
client.on('warn', info => {
  logger.log('warn info = ...')
  logger.log(info)
})

client.on('commandBlocked', (msg, str) => {
  logger.log('Command Blocked...')
  logger.log(msg)
})

client.on('unknownCommand', msg => {
  if (msg.channel.id !== config.testChannel) {  // Default testing channel, don't respond.
    let query = msg.content.substring(client.commandPrefix.length)
    tools.queryGiphy(query, client.user.username, client.user.displayAvatarURL())
      .then(res => { if (res !== null) msg.channel.send(res) })
      .catch(err => logger.error(err))
  }
})

client.on('commandError', (cmd, err) => logger.error(err))

client.on('error', err => logger.error(err))

client.login(config.token)

const IPC = require('./util/IPC')
const ipc = new IPC(client).ipc
ipc.server.start()
