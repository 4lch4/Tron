const Command = require('../BaseCmd')
const mongo = new (require('../../util/db/MongoTools'))()

class RemoveRole extends Command {
  constructor (client) {
    super(client, {
      name: 'remove-role',
      group: 'admin',
      memberName: 'remove-role',
      description: 'Removes a role from the list of available roles.',
      examples: ['+remove-role NSFW Pass'],
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      args: [{
        key: 'role',
        type: 'role',
        prompt: 'Which role would you like to remove?',
        label: 'Role'
      }]
    })
  }

  async run (msg, { role }) {
    mongo.removeAvailableRole(msg.guild.id, { id: role.id, name: role.name })
      .then(val => {
        msg.channel.send(`You've successfully removed the ${role.name} role.`)
      })
      .catch(err => msg.channel.send(err.message))
  }
}

module.exports = RemoveRole
