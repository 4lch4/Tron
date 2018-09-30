const Command = require('../BaseCmd')
const { MessageEmbed } = require('discord.js')
const Moment = require('moment')

class Server extends Command {
  constructor (client) {
    super(client, {
      name: 'server',
      memberName: 'server',
      group: 'features',
      description: 'Lists some basic information of the current server.',
      aliases: ['serverinfo'],
      examples: ['+server', '+serverinfo'],
      guildOnly: true
    })
  }

  async run (msg, args) {
    let embed = new MessageEmbed({
      'title': msg.guild.name,
      'description': `Server Id: ${msg.guild.id}\nServerRegion: ${msg.guild.region.toUpperCase()}`,
      'timestamp': new Moment().toDate(),
      'thumbnail': msg.guild.iconURL(),
      'color': 4682777,
      'author': {
        'name': msg.author.username,
        'icon_url': msg.author.avatarURL()
      },
      'footer': {
        'text': 'Server Info',
        'icon_url': this.client.user.avatarURL()
      },
      'fields': [{
        'name': 'Explicit Content Filter',
        'value': convertContentFilter(msg.guild),
        'inline': true
      }, {
        'name': 'Emojis',
        'value': msg.guild.emojis.size,
        'inline': true
      }, {
        'name': 'Members',
        'value': msg.guild.members.size,
        'inline': true
      }, {
        'name': 'Roles',
        'value': msg.guild.roles.size,
        'inline': true
      }, {
        'name': 'Tron Joined On',
        'value': new Moment(msg.guild.joinedAt).format('MMMM Do YYYY @ HH:mm:ss')
      }, {
        'name': 'Server Created On',
        'value': new Moment(msg.guild.createdAt).format('MMMM Do YYYY @ HH:mm:ss')
      }, {
        'name': 'Currently Owned By',
        'value': msg.guild.owner.user.username
      }]
    })

    Command.sendMessage(msg.channel, '', this.client.user, embed)
  }
}

module.exports = Server

const convertContentFilter = guild => {
  switch (guild.explicitContentFilter) {
    case 0:
      return 'OFF'

    case 1:
      return 'On for people without roles'

    case 2:
      return 'On for all'

    default:
      break
  }
}
