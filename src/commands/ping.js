const { Command } = require('discord-akairo')
const { Message } = require('discord.js')

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping']
    })
  }

  /**
   * The function to execute when the Ping command is called.
   *
   * @param {Message} message The message that triggered the command.
   * @param {*} _args The arguments provided to the command.
   */
  async exec(message, _args) {
    return message.reply('Pong!')
  }
}

module.exports = PingCommand
