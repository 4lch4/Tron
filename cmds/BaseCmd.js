const { Command } = require('discord.js-commando')
const logger = new (require('../util/logger'))()

module.exports = class BaseCmd extends Command {
  log (info) {
    return logger.log(info)
  }

  warn (warning) {
    return logger.warn(warning)
  }

  error (err) {
    return logger.error(err)
  }

  getUsernames (userIds) {
    let usernames = []
    userIds.forEach(id => usernames.push(this.client.users.get(id).username))
    return usernames
  }

  getMentionedUsernames (msg) {
    let usernames = []

    msg.mentions.users.forEach(user => usernames.push(user.username))

    return `**${usernames.join('**, **')}**`
  }

  /**
   * Cleans each argument within the array by converting it to lowercase and
   * trimming any whitespace then adding it to a new array of the cleaned values
   * to be returned.
   *
   * @param {string[]} args
   *
   * @returns {string[]}
   */
  cleanArgs (args) {
    let newArgs = []
    args.forEach(val => newArgs.push(val.trim().toLowerCase()))
    return newArgs
  }
}
