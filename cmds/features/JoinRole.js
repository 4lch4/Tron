const Command = require('../BaseCmd')
const mongo = new (require('../../util/db/MongoTools'))()

class JoinRole extends Command {
  constructor (client) {
    super(client, {
      name: 'join-role',
      group: 'features',
      memberName: 'join-role',
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
    let available = await mongo.isRoleAvailable(msg.guild.id, role.name)
    if (available) {
      console.log(msg.member)
      msg.member.addRole(role.id).then(() => {
        msg.channel.send(`You've successfully been added to the ${role.name} role!`)
      }).catch(err => {
        if (err.code === 50013) {
          msg.channel.send('It appears that I don\'t have permission to give you that role. Please contact the server administrator to fix this.')
        }

        console.error(err)
      })
    } else msg.channel.send('D\'awww, it isn\'t available.')
  }
}

module.exports = JoinRole
