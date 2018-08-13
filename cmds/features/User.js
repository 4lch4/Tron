const BaseCmd = require('../BaseCmd')
const { MessageEmbed } = require('discord.js')
const info = require('../../package.json')
const tools = new (require('../../util/Tools'))()

class User extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'user',
      memberName: 'user',
      group: 'features',
      description: 'Displays various information about the mentioned user.',
      aliases: ['userinfo', 'user-info'],
      examples: ['+user @Alcha#2625']
    })
  }

  async run (msg, args) {
    switch (msg.mentions.users.size) {
      case 0:
        var member = msg.member
        var user = msg.author
        break
      case 1:
        member = msg.mentions.members.array()[0]
        user = member.user
        break
    }

    let embed = new MessageEmbed({
      'title': member.tag,
      'footer': {
        'icon_url': this.client.user.avatarURL,
        'text': `Tron - ${info.version}`
      },
      'color': 8824426,
      'thumbnail': {
        'url': user.avatarURL()
      },
      'author': {
        'name': 'Tron',
        'url': 'https://paranoiddevs.com/tron',
        'icon_url': this.client.user.avatarURL()
      },
      'fields': generateFields(user, member)
    })

    return msg.channel.send('', embed)
  }
}

module.exports = User

const generateFields = (user, member) => {
  let presence = null
  let fields = []

  if (user.presence) presence = parseUserPresence(user.presence)

  if (presence.details !== null) {
    fields.push({
      'name': 'Activity Details',
      'value': presence.details
    })
  }

  if (presence.name !== null) {
    fields.push({
      'name': 'Activity Name',
      'value': presence.name
    })
  }

  fields.push({
    'name': 'User Id',
    'value': member.id,
    'inline': true
  }, {
    'name': 'Created On',
    'value': tools.formatUnixInput(user.createdTimestamp),
    'inline': true
  }, {
    'name': 'Status',
    'value': user.presence.status.toUpperCase(),
    'inline': true
  }, {
    'name': 'Joined Server On',
    'value': tools.formatUnixInput(member.joinedTimestamp),
    'inline': true
  })

  return fields
}

const parseUserPresence = presence => {
  let presenceOut = { name: '', details: '' }

  if (presence.activity !== null) {
    presenceOut.name = presence.activity.name
    presenceOut.details = presence.activity.details
  }

  return presenceOut
}
