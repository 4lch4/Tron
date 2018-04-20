const Command = require('../BaseCmd')
// const mongo = new (require('../../util/db/MongoTools'))()

class LeaveRole extends Command {
  constructor (client) {
    super(client, {
      name: 'leave-role',
      group: 'features',
      memberName: 'leave-role',
      throttling: { usages: 1, duration: 10 },
      guildOnly: true,
      description: 'Leave a role from the list of available roles (+list-roles) for this server.',
      examples: ['+leave-role NSFW Pass'],
      args: [{
        key: 'role',
        type: 'role',
        prompt: 'Which role would you like to leave?',
        label: 'Role'
      }]
    })
  }

  async run (msg, { role }) {
    msg.member.removeRole(role).then(member => {
      msg.channel.send(`You've successfully been removed from the ${role.name} role!`)
    }).catch(err => {
      if (err.code === 50013) {
        msg.channel.send('It appears that I don\'t have permission to remove that role. Please contact the server administrator to fix this.')
      }

      console.error(err)
    })
  }
}

module.exports = LeaveRole
