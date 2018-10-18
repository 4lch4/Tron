const config = require('./config.json')
const logger = new (require('./logger'))()
const ipc = require('node-ipc')
const { Client } = require('discord.js') // Used for JSDocs

const os = require('os').type()
let ipcPath = ''
if (os === 'Windows_NT') ipcPath = 'D:\\app.tron-primary'
else ipcPath = '/home/alcha/tron/app.tron-primary'

/**
 * Handles inter-process communication (IPC), using node-ipc, for Tron.
 * Currently, it's only used to receive data from BabyTron in order to get
 * birthday information.
 *
 * @prop {Client} client  The Discord.js client for Tron
 * @prop {ipc} ipc
*/
class IPC {
  /**
   * Default constructor for the IPC class. Requires the Client that is hosting
   * Tron in order to send messages to the birthday receipients.
   *
   * @param {Client} client The Discord.js client for Tron
   */
  constructor (client) {
    this.client = client
    this.ipc = ipc

    ipc.config.id = config.tronProcess
    ipc.config.retry = 2500
    ipc.config.silent = false

    ipc.serve(() => {
      ipc.server.on(config.timerMsg, msg => this.onBdayMsgReceived(msg))
    })
  }

  /**
   * The function called when some birthday information is received from
   * BabyTron.
   *
   * @param {string[]} msg Contains the user ids of those w/ a bday
   */
  onBdayMsgReceived (msg) {
    logger.info('Birthday update received!')
    msg.forEach(bday => {
      logger.info(`Wishing happy birthday to user ${bday._id}.`)
      this.sendUserWish(bday._id).catch(err => logger.error(err))
    })
  }

  /**
   * Sends a happy birthday message to a user with the provided user id.
   *
   * @param {string} userId The id of the user you wish to say happy bday to
   */
  sendUserWish (userId) {
    return new Promise((resolve, reject) => {
      this.client.users.get(userId).createDM().then(channel => {
        resolve(channel.send('Happy birthday! :birthday:'))
      }).catch(err => reject(err))
    })
  }
}

module.exports = IPC
