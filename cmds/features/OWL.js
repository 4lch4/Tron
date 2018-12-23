const Command = require('../BaseCmd')
const {
  validateTeamArg,
  parseTeamArg,
  formatTeamOutput,
  teamLogos,
  getTeamShortName
} = require('../util/OWL')

class OWL extends Command {
  constructor (client) {
    super(client, {
      name: 'owl',
      group: 'features',
      memberName: 'owl',
      guildOnly: false,
      description: 'Placeholder text.',
      examples: ['+owl', '+owl Houston Outlaws'],
      args: [
        {
          'key': 'team',
          'label': 'team',
          'prompt': 'Which team do you want information on?',
          'validate': val => validateTeamArg(val),
          'parse': val => parseTeamArg(val),
          'type': 'string'
        }
      ]
    })
  }

  async run (msg, { team }) {
    if (team.toLowerCase() === 'list') {
      let output = 'Here is a list of all the available teams:\n\n' + formatTeamOutput()
      return Command.sendMessage(msg.channel, output, this.client.user)
    } else {
      let shortName = getTeamShortName(team).toLowerCase()
      return Command.sendMessage(msg.channel, team, this.client.user, { files: teamLogos[shortName].path })
    }
  }
}

module.exports = OWL
