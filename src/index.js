const { AkairoClient, CommandHandler } = require('discord-akairo')
const { join } = require('path')
const { config } = require('./util')

const AkairoOpts = { ownerID: config.ownerId }
const DJSOpts = { disableMentions: 'everyone' }
const cHandlerOpts = {
  directory: join(__dirname, 'commands'),
  prefix: config.commandPrefix
}

class Tron extends AkairoClient {
  commandHandler

  constructor() {
    super(AkairoOpts, DJSOpts)

    this.commandHandler = new CommandHandler(this, cHandlerOpts)
    this.commandHandler.loadAll()
  }
}

const main = async () => {
  try {
    const tron = new Tron()
    return tron.login(config.discordToken)
  } catch (err) {
    return err
  }
}

main()
  .then(res => {
    console.log(res)
    console.log('Execution complete!')
  })
  .catch(console.error)
