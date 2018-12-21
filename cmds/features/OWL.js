const Command = require('../BaseCmd')
const owlAid = require('../util/OWL')

class OWL extends Command {
  constructor (client) {
    super(client, {
      name: 'owl',
      group: 'features',
      memberName: 'owl',
      guildOnly: false,
      description: 'Placeholder text.',
      examples: ['+owl', '+owl nsfw'],
      args: [
        {
          'key': 'team',
          'label': 'team',
          'prompt': 'Which team do you want information on?',
          'validate': val => owlAid.validateTeamArg(val),
          'parse': val => owlAid.parseTeamArg(val),
          'type': 'string'
        }
      ]
    })
  }

  async run (msg, { team }) {
    if (team.toLowerCase() === 'list') {
      let output = 'Here is a list of all the available teams:\n\n' + owlAid.formatTeamOutput()
      return Command.sendMessage(msg.channel, output, this.client.user)
    } else {
      let shortName = team.substring(team.lastIndexOf(' ') + 1).toLowerCase()
      return Command.sendMessage(msg.channel, team, this.client.user, { files: [owlAid.logos[shortName].path] })
    }
  }
}

module.exports = OWL
