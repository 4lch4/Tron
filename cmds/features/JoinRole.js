const { Command } = require('discord.js-commando')
const mongo = new (require('../../util/db/MongoTools'))()

class JoinRole extends Command {
  constructor (client) {
    super(client, {
      name: 'join-role',
      group: 'features',
      memberName: 'join-role',
      throttling: { usages: 1, duration: 10 },
      guildOnly: true,
      description: 'Join a role from the list of available roles (+list-roles) for this server.',
      examples: ['+join-role NSFW Pass'],
      args: [{
        key: 'role',
        type: 'role',
        prompt: 'Which role would you like to join?',
        label: 'Role'
      }]
    })
  }

  async run (msg, { role }) {
    mongo.isRoleAvailable(msg.guild.id, role.name).then(available => {
      if (available) {
        msg.member.addRole(role.id).then(member => {
          msg.channel.send(`You've successfully been added to the ${role.name} role!`)
        }).catch(err => {
          if (err.code === 50013) {
            msg.channel.send('It appears that I don\'t have permission to give you that role. Please contact the server administrator to fix this.')
          }

          console.error(err)
        })
      } else msg.channel.send('D\'awww, it isn\'t available.')
    })
  }
}

module.exports = JoinRole
