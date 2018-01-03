const { Command } = require('discord.js-commando')
const mongo = new (require('../../util/db/MongoTools'))()

class AddRole extends Command {
  constructor (client) {
    super(client, {
      name: 'add-role',
      group: 'admin',
      memberName: 'add-role',
      throttling: { usages: 1, duration: 5 },
      description: 'Adds a role to the list of available roles for users to join.',
      examples: ['+add-role NSFW Pass'],
      userPermissions: ['ADMINISTRATOR'],
      args: [{
        key: 'role',
        type: 'role',
        prompt: 'Which role would you like to add?',
        label: 'Role'
      }]
    })
  }

  async run (msg, { role }) {
    mongo.addAvailableRole(msg.guild.id, {id: role.id, name: role.name})
      .then(res => {
        msg.channel.send(`You've successfully added the ${role.name} role to the list.`)
      })
      .catch(err => {
        if (err) {
          msg.channel.send(err.message)
        }
      })
  }
}

module.exports = AddRole
