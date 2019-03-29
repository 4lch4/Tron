const BaseCmd = require('../BaseCmd')
const mongoUrl = 'mongodb://127.0.0.1/agenda'
const Agenda = require('agenda')
const agenda = new Agenda({ db: { address: mongoUrl } })
const ReminderUtil = require('../util/ReminderUtil')

class Reminder extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'reminder',
      memberName: 'reminder',
      group: 'features',
      description: 'Allows you to set a reminder for Tron to help you remember.',
      aliases: ['remindme', 'remind', 'timer', 'event'],
      examples: ['+remindme Go to the store for milk & eggs in 1 day 22 hours and 12 minutes']
    })
  }

  /**
   * Parses the given msg and args values for the Reminder command and executes
   * the necessary code.
   *
   * @param {CommandoMessage} msg The Message object that executed the command.
   * @param {String} args Argument values.
   */
  async run (msg, args) {
    const remUtil = new ReminderUtil()
    args = args.split(' ')

    if (args.length === 1) {
      switch (args[0].toLowerCase()) {
        case 'remove': return msg.reply('Remove command received...')
        case 'list': return msg.reply('List command received...')
      }
    } else {
      const cleanData = await remUtil.parseUserInput(msg, args)
      console.log(`cleanData...`)
      console.log(cleanData)
    }
  }
}

module.exports = Reminder

// #region For JSDocs
const { CommandoMessage } = require('discord.js-commando')
// #endregion For JSDocs
