const mongoose = require('mongoose')
const baseUri = 'mongodb://localhost'
const roleSchema = mongoose.Schema({
  _id: Number,
  name: String
})

class MongoTools {
  /**
   * Add the provided role to the server db in the availableRoles collection.
   *
   * @param {number} serverId
   * @param {Object} role
   * @param {number} role.id
   * @param {string} role.name
   */
  addAvailableRole (serverId, role) {
    return new Promise((resolve, reject) => {
      mongoose.connect(`${baseUri}/${serverId}`)
      const Role = mongoose.connection.model('availableRole', roleSchema)
      const db = mongoose.connection

      db.once('open', () => {
        const newRole = new Role({
          _id: role.id,
          name: role.name
        })

        Role.count({ _id: newRole._id }, (err, count) => {
          if (err) reject(err)
          else if (count === 0) {
            newRole.save(err => {
              if (err) console.error(err)
              else resolve()
            })
          } else {
            reject(new Error('The requested role has already been added.'))
          }
        })
      })
    })
  }

  /**
   * Removes the provided role from the given servers collection of available roles.
   *
   * @param {number} serverId
   * @param {Object} role
   * @param {number} role.id
   * @param {string} role.name
   */
  removeAvailableRole (serverId, role) {
    return new Promise((resolve, reject) => {
      mongoose.connect(`${baseUri}/${serverId}`)
      const Role = mongoose.connection.model('availableRole', roleSchema)
      const db = mongoose.connection

      db.once('open', () => {
        const newRole = new Role({
          _id: role.id,
          name: role.name
        })

        Role.count({ _id: newRole._id }, (err, count) => {
          if (err) reject(err)
          else if (count > 0) {
            newRole.remove((err, val) => {
              if (err) console.error(err)
              else resolve(val)
            })
          } else {
            reject(new Error('The requested role has not been added, yet.'))
          }
        })
      })
    })
  }

  /**
   * Verifies if the given role name is available to users on the given server.
   *
   * @param {number} serverId
   * @param {string} roleName
   */
  isRoleAvailable (serverId, roleName) {
    return new Promise((resolve, reject) => {
      mongoose.connect(`${baseUri}/${serverId}`)
      const Role = mongoose.connection.model('availableRole', roleSchema)
      const db = mongoose.connection

      db.once('open', () => {
        Role.count({ name: roleName }, (err, count) => {
          if (err) reject(err)
          else if (count > 0) resolve(true)
          else resolve(false)
        })
      })
    })
  }

  /**
   * Gets the full list of available roles for the given server.
   *
   * @param {number} serverId
   */
  getAvailableRoles (serverId) {
    return new Promise((resolve, reject) => {
      mongoose.connect(`${baseUri}/${serverId}`)
      const Role = mongoose.connection.model('availableRole', roleSchema)
      const db = mongoose.connection

      db.once('open', () => {
        Role.find({}, (err, res) => {
          if (err) reject(err)
          else resolve(res)
        })
      })
    })
  }
}

module.exports = MongoTools
