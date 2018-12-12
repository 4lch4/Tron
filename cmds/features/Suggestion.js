const Command = require('../BaseCmd')

const SuggestionDb = require('../../util/db/Suggestion')
const tools = new (require('../../util/Tools'))()

class Suggestion extends Command {
  constructor (client) {
    super(client, {
      name: 'suggestion',
      group: 'features',
      memberName: 'suggestion',
      aliases: ['suggest'],
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

    try {
      let success = await suggestion.save()
      if (success) {
        await msg.reply('thank you for your suggestion!')
        return tools.sendOwnerMessage(`A new suggestion has been added by ${msg.author.username}.`, this.client)
      } else return msg.reply('there seems to have been an error... Please contact support.')
    } catch (err) {
      console.error(err)
      return msg.reply('there seems to have been an error, please contact `+support`.')
    }
  }
}

module.exports = Suggestion
