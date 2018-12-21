const Command = require('../BaseCmd')
const { logos, getTeamSchedule, teamNames } = require('../util/OWL')

// const tools = new (require('../../util/Tools'))()

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
      let shortName = team.substring(team.lastIndexOf(' ') + 1).toLowerCase()
      return Command.sendMessage(msg.channel, team, this.client.user, { files: [logos[shortName].path] })
    }
  }
}

const formatTeamOutput = () => {
  let output = ''

  for (let x = 0; x < teamNames.length; x++) {
    output += `**${x})** \`${teamNames[x]}\`\n`
  }

  return output
}

const parseTeamArg = val => {
  if (isNaN(val)) {
    return val
  } else return teamNames[val]
}

const validateTeamArg = val => {
  if (teamNames.includes(val) ||
      val.toLowerCase() === 'list' ||
      (val >= 0 && val < teamNames.length)) return true
  else return 'Please provide a valid team name, including their city, or `list` to list available team names.'
}

module.exports = OWL
