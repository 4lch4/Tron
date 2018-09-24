const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')
const tools = new (require('./util/Tools'))()
const CommandHelper = require('./util/db/CommandHelper')

const config = require('./util/config.json')

const timber = require('timber')
const transport = new timber.transports.HTTPS(process.env.TIMBER_KEY)
timber.install(transport)

const client = new CommandoClient({
  commandPrefix: process.env.CMD_PREFIX,
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

    console.log(`Updating activity to ${activity}`, false)

    client.user.setActivity(activity)
  }, 120000)

  console.log(`Tron ${process.env.NODE_ENV.toUpperCase()} has come online > ${readyTime}`)
})

client.on('commandRun', (cmd, promise, msg) => {
  console.log(`Running ${cmd.name} on server ${msg.guild.name} by ${msg.author.username}...`)
  const command = new CommandHelper(msg, cmd)

  command.updateUsage(cmd.name).catch(err => console.error(err))
})

client.on('warn', info => {
  console.log('warn info = ...')
  console.log(info)
})

client.on('commandBlocked', (msg, str) => {
  console.log('Command Blocked...')
  console.log(msg)
})

client.on('unknownCommand', msg => {
  if (msg.channel.id !== config.testChannel) { // Default testing channel, don't respond.
    let query = msg.content.substring(client.commandPrefix.length)
    tools.queryGiphy(query, client.user.username, client.user.displayAvatarURL())
      .then(res => { if (res !== null) msg.channel.send(res) })
      .catch(err => console.error(err))
  }
})

client.on('commandError', (cmd, err) => console.error(err))

client.on('error', err => console.error(err))

let zenCount = 0

client.on('message', msg => {
  if (msg.mentions.users.get(client.user.id) !== undefined) {
    console.log('Tron mentioned.')
    console.log(msg.content)
  } else if (msg.content.startsWith(client.commandPrefix)) {
    console.log(`Command used.`)
    console.log(msg.content)
  }

  if (msg.author.id === '150319175326236672') {
    if (zenCount === 10) {
      zenCount = 0
      return msg.reply('meh.')
    } else zenCount++
  }
})

client.login(process.env.DISCORD_KEY)

const IPC = require('./util/IPC')
const ipc = new IPC(client).ipc
ipc.server.start()
