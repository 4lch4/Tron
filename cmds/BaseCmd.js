const { Command } = require('discord.js-commando')

module.exports = class BaseCmd extends Command {
  generateUsernames (msg) {
    let usernames = []

    msg.mentions.users.forEach(user => usernames.push(user.username))

    return `**${usernames.join('**, **')}**`
  }
}
