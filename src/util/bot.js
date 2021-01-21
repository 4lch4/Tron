const { join } = require('path')
const { commandPrefix, ownerId } = require('./config')

module.exports = {
  akairoOpts: { ownerID: ownerId },
  djsOpts: { disableMentions: 'everyone' },
  commandHandlerOpts: {
    directory: join(__dirname, '..', 'commands'),
    prefix: commandPrefix
  }
}
