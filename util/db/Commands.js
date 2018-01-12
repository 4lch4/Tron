const mongoose = require('mongoose')
const CmdSchema = mongoose.Schema({
  _id: String,
  uses: Number
})

module.exports = class Commands {
  constructor (serverId) {
    this.serverId = serverId
    this.connection = mongoose.createConnection('mongodb://localhost/data')
    this.model = this.connection.model('Command', CmdSchema, this.serverId)
  }

  getCmdCount () {
    return new Promise((resolve, reject) => {
      this.model.count({}, (err, count) => {
        if (err) reject(err)
        else {
          resolve(count)
        }
      })
    })
  }

  getCount (cmdName) {
    return new Promise((resolve, reject) => {
      this.model.count({_id: cmdName}, (err, count) => {
        if (err) reject(err)
        else {
          resolve(count)
        }
      })
    })
  }

  addCommand (cmdName) {
    return new Promise((resolve, reject) => {
      this.model.create({
        _id: cmdName,
        uses: 1
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  incrementUsage (cmdName) {
    return new Promise((resolve, reject) => {
      this.getCount(cmdName).then(count => {
        if (count === 0) {
          resolve(this.addCommand(cmdName))
        } else {
          this.model.findById(cmdName, (err, res) => {
            if (err) reject(err)
            else {
              res.uses++
              resolve(res.save())
            }
          })
        }
      })
    })
  }
}
