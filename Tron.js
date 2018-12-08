const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const CommandHelper = require('./util/db/CommandHelper')
const tools = new (require('./util/Tools'))()
const { sendMessage } = require('./cmds/BaseCmd')
const config = require('./util/config.json')
const sqlite = require('sqlite')
const path = require('path')

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

  sendMessage(client.channels.get(config.notificationChannel), `<@219270060936527873>, Tron has come online > **${readyTime}**`, client.user)
  // client.channels.get(config.notificationChannel).send(`<@219270060936527873>, Tron has come online > **${readyTime}**`)

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
  if (msg.guild !== null) {
    console.log(`Running ${cmd.name} on server ${msg.guild.name} by ${msg.author.username}...`)
    const command = new CommandHelper(msg, cmd)

    command.updateUsage(cmd.name).catch(err => console.error(err))
  }
})

client.on('unknownCommand', msg => {
  if (msg.channel.id !== config.testChannel) { // Default testing channel, don't respond.
    try {
      let query = msg.content.substring(client.commandPrefix.length)
      tools.queryGiphy(query, client.user.username, client.user.displayAvatarURL())
        .then(res => { if (res !== null) { sendMessage(msg.channel, '', client.user, res) } })
    } catch (err) { console.error(err) }
  }
})

client.on('commandError', (cmd, err) => console.error(err))
client.on('error', err => console.error(err))
client.on('warn', info => console.log(info))

let zenCount = 0
let volCount = 0

const volInsults = [
  'is lame.',
  'smells like cheese.'
]

client.on('message', msg => {
  switch (msg.author.id) {
    case '493093339663695912': // Volcano Queen
      if (volCount === 5) {
        volCount = 0
        return msg.reply(volInsults[tools.getRandom(0, volInsults.length)])
      } else volCount++
      break
    case '150319175326236672': // Zenny
      if (zenCount === 10) {
        zenCount = 0
        return msg.reply('meh.')
      } else zenCount++
      break
  }
})

client.login(process.env.DISCORD_KEY)

const IPC = require('./util/IPC')
const ipc = new IPC(client).ipc
ipc.server.start()
