const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const CommandHelper = require('./util/db/CommandHelper')
const { sendMessage } = require('./cmds/BaseCmd')
const {
  queryGiphy,
  searchForAlot,
  sendStartupMessages,
  initRotatingActivity
} = new (require('./util/Tools'))()
const config = require('./util/config.json')
const sqlite = require('sqlite')
const path = require('path')

let zenCount = 0

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
  initRotatingActivity(2, client)
  sendStartupMessages(client)
})

client.on('commandRun', (cmd, promise, msg) => {
  if (msg.guild !== null) {
    new CommandHelper(msg, cmd)
      .updateUsage(cmd.name)
      .catch(err => console.error(err))
  }
})

client.on('unknownCommand', msg => {
  if (msg.channel.id !== config.testChannel) { // Default testing channel, don't respond.
    try {
      let query = msg.content.substring(client.commandPrefix.length)
      queryGiphy(query, client.user.username, client.user.displayAvatarURL())
        .then(res => { if (res !== null) { sendMessage(msg.channel, '', client.user, res) } })
        .catch(console.error)
    } catch (err) { console.error(err) }
  }
})

client.on('message', msg => {
  switch (msg.author.id) {
    case '150319175326236672': // Zenny
      if (zenCount === 10) {
        zenCount = 0
        return msg.reply('meh.')
      } else zenCount++
      break
  }

  searchForAlot(msg, client)
})

client.on('commandError', (cmd, err) => console.error(err))
client.on('error', err => console.error(err))
client.on('warn', info => console.log(info))
client.login(process.env.DISCORD_KEY)

const IPC = require('./util/IPC')
const ipc = new IPC(client).ipc
ipc.server.start()
