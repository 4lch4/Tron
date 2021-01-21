const { AkairoClient, CommandHandler } = require('discord-akairo')
const { config, bot, logger } = require('./util')

class Tron extends AkairoClient {
  commandHandler

  constructor() {
    super(bot.akairoOpts, bot.djsOpts)

    this.commandHandler = new CommandHandler(this, bot.commandHandlerOpts)
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
    logger.info(res)
    logger.info('Execution complete!')
  })
  .catch(logger.error)
