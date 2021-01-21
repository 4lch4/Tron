const {
  AkairoClient,
  CommandHandler,
  InhibitorHandler
} = require('discord-akairo')
const { join } = require('path')
const { config, logger } = require('./util')

const akairoOpts = { ownerID: config.ownerId }
const djsOpts = { disableMentions: 'everyone' }
const commanderOpts = {
  directory: join(__dirname, 'commands'),
  prefix: config.commandPrefix
}

class Tron extends AkairoClient {
  commandHandler

  constructor() {
    super(akairoOpts, djsOpts)

    this.commandHandler = new CommandHandler(this, commanderOpts)
    this.commandHandler.loadAll()
    const inhibitorOpts = new InhibitorHandler()
  }
}

new Tron()
  .login(config.discordToken)
  .then(res => {
    logger.info(res)
    logger.info('Execution complete!')
  })
  .catch(logger.error)
