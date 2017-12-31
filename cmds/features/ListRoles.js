const { Command } = require('discord.js-commando')
const mongo = new (require('../../util/MongoTools'))()

class GetRoles extends Command {
  constructor (client) {
    super(client, {
      name: 'list-roles',
      group: 'features',
      memberName: 'list-roles',
      throttling: { usages: 1, duration: 5 },
      description: 'List the available roles to join for this server.',
      examples: ['+list-roles']
    })
  }

  async run (msg, args) {
    mongo.getAvailableRoles(msg.guild.id).then(roles => {
      let content = 'Available Roles:\n' + '```markdown\n'

      roles.forEach(val => {
        content += `- ${val.name}\n`
      })

      msg.channel.send(content + '```')
    }).catch(err => console.log(err))
  }
}

module.exports = GetRoles
