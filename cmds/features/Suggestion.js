const { Command } = require('discord.js-commando')

const SuggestionDb = require('../../util/db/Suggestion')
const tools = new (require('../../util/Tools'))()

class Suggestion extends Command {
  constructor (client) {
    super(client, {
      name: 'suggestion',
      group: 'features',
      memberName: 'suggestion',
      aliases: ['suggest'],
      throttling: { usages: 1, duration: 10 },
      description: 'Stores your suggestion in our database for the team to look at.',
      examples: ['+suggestion I think you should add a cry command.', '+suggest Y\'all suck.'],
      argsType: 'single'
    })
  }

  async run (msg, input) {
    const suggestion = new SuggestionDb(
      tools.utcTime,
      msg.author.id,
      input
    )

    suggestion.save().then(success => {
      if (success) msg.reply('thank you for your suggestion!')
      else msg.reply('there seems to have been an error... Please contact support.')
    }).catch(err => console.error(err))
  }
}

module.exports = Suggestion
