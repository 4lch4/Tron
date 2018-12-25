const Command = require('../BaseCmd')
const {
  teamLogos,
  parseTeamArg,
  validateTeamArg,
  formatTeamOutput,
  getTeamShortName,
  parseInstructionArg,
  validateInstructionArg
} = require('../util/OWL')

class OWL extends Command {
  constructor (client) {
    super(client, {
      name: 'owl',
      group: 'features',
      memberName: 'owl',
      guildOnly: false,
      description: 'Get the latest info regarding the 2019 season of the Overwatch League.',
      examples: ['+owl', '+owl Houston Outlaws'],
      args: [
        {
          'key': 'instruction',
          'label': 'instruction',
          'type': 'string',
          'validate': val => validateInstructionArg(val),
          'parse': val => parseInstructionArg(val),
          'prompt': 'What type of information are you looking for? You can use `list` to display the available instructions.'
        },
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

  async run (msg, { instruction, team }) {
    switch (instruction) {
      case 'schedule': {
        if (team.toLowerCase() === 'list') {
          let output = 'Here is a list of all the available teams:\n\n' + formatTeamOutput()
          return Command.sendMessage(msg.channel, output, this.client.user)
        } else {
          let shortName = getTeamShortName(team).toLowerCase()
          console.log(`shortName = ${shortName}`)
          console.log(`teamLogos[shortName].path = ${teamLogos[shortName].path}`)
          return Command.sendMessage(msg.channel, team, this.client.user, { files: teamLogos[shortName].path })
        }
      }
    }
  }
}

module.exports = OWL
