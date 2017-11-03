
class AdminTools {
  constructor (options) {
    this.options = options || {}
  }

  initializeServer (bot, msg) {
    return new Promise((resolve, reject) => {
      this.createMuteRole(msg).then(role => {
        this.updateMuteRoles(msg, role).then(success => {
          resolve(success)
        })
      })
    })
  }

  createMuteRole (msg) {
    return new Promise((resolve, reject) => {
      msg.channel.guild.createRole({name: 'tron-mute'})
        .then(role => { resolve(role) })
    })
  }

  updateMuteRole (channel, muteRole) {
    return new Promise((resolve, reject) => {
      if (parseInt(channel.type) === 2) {
        // Voice channel
        channel.editPermission(muteRole, undefined, 2097152, 'role')
        .then(permOverwrite => { resolve(permOverwrite) })
        .catch(err => {
          if (err) {
            console.log('An error occured when editing mute role.')
            console.log(err)
          }
        })
      } else if (parseInt(channel.type) === 0) {
        // Text channel
        channel.editPermission(muteRole, undefined, 2048, 'role')
        .then(permOverwrite => { resolve(permOverwrite) })
        .catch(err => {
          if (err) {
            console.log('An error occured when editing mute role.')
            console.log(err)
          }
        })
      } else {
        resolve(undefined)
      }
    })
  }

  updateMuteRoles (msg, muteRole) {
    return new Promise((resolve, reject) => {
      let count = 0

      msg.channel.guild.channels.forEach((channel, index, map) => {
        this.updateMuteRole(channel, muteRole.id).then(permOverwrite => {
          count++
          if (count === map.size) resolve(true)
        })
      })
    })
  }
}

module.exports = AdminTools
