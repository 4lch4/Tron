const mongoose = require('mongoose')
const CmdSchema = mongoose.Schema({
  _id: String,
  uses: Number
})

const colors = require('../../util/colors').Decimal

const formatMostUsed = (results) => {
  return new Promise((resolve, reject) => {
    let embedObj = {
      embed: {
        color: colors.green.P500,
        description: `A list of commands and their use count for this server.`,
        fields: []
      }
    }

    if (results.length === 0) {
      embedObj.embed.color = colors.red.P500
      embedObj.embed.description = 'It appears no commands have been executed on this server, yet.'
    } else {
      results.forEach((val, index, array) => {
        embedObj.embed.fields.push({
          name: val._id,
          value: val.uses,
          inline: true
        })
      })
    }

    resolve(embedObj)
  })
}

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
      this.model.count({ _id: cmdName }, (err, count) => {
        if (err) reject(err)
        else {
          resolve(count)
        }
      })
    })
  }

  getMostUsed () {
    return new Promise((resolve, reject) => {
      this.model.find({}, [], { sort: { uses: -1 } }, (err, results) => {
        if (err) reject(err)
        else {
          resolve(formatMostUsed(results))
        }
      })
    })
  }

  getUsage (cmdName) {
    return new Promise((resolve, reject) => {
      this.model.findById(cmdName, (err, res) => {
        if (err) reject(err)
        else {
          if (res === null) resolve(0)
          else resolve(res.uses)
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
