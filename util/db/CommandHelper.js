const { Message } = require('discord.js-commando') // Used for JSDocs

const mongoose = require('mongoose')
const CmdSchema = mongoose.Schema({
  _id: String,
  uses: Number,
  lastUsed: Number
})

const UserSchema = mongoose.Schema({
  _id: String,
  cmds: [{
    _id: String,
    name: String,
    uses: Number
  }]
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

module.exports = class CommandHelper {
  /**
   * Default constructor for the CommandHelper. The Message object is used for
   * user, server, and (if available) command info.
   *
   * @param {Message} msg
   */
  constructor (msg, cmd) {
    if (msg.guild) this.serverId = msg.guild.id
    else this.serverId = msg.channel.id
    this.userId = msg.author.id
    this.cmd = msg.command
    this.msg = msg
    this.connection = mongoose.createConnection('mongodb://localhost/data')
    this.cmdModel = this.connection.model('Command', CmdSchema, this.serverId.toString())
    this.userModel = this.connection.model('User', UserSchema, 'users')
  }

  getCmdCount () {
    return new Promise((resolve, reject) => {
      this.cmdModel.countDocuments({}, (err, count) => {
        if (err) reject(err)
        else {
          resolve(count)
        }
      })
    })
  }

  getCount (cmdName) {
    return new Promise((resolve, reject) => {
      this.cmdModel.countDocuments({ _id: cmdName }, (err, count) => {
        if (err) reject(err)
        else {
          resolve(count)
        }
      })
    })
  }

  getMostUsed () {
    return new Promise((resolve, reject) => {
      this.cmdModel.find({}, [], { sort: { uses: -1 } }, (err, results) => {
        if (err) reject(err)
        else {
          resolve(formatMostUsed(results))
        }
      })
    })
  }

  getUsage (cmdName) {
    return new Promise((resolve, reject) => {
      this.cmdModel.findById(cmdName, (err, res) => {
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
      this.cmdModel.create({
        _id: cmdName,
        uses: 1
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  updateUsage (cmdName) {
    return new Promise((resolve, reject) => {
      this.getCount(cmdName).then(count => {
        if (count === 0) {
          resolve(this.addCommand(cmdName))
        } else {
          this.cmdModel.findById(cmdName, (err, res) => {
            if (err) reject(err)
            else {
              res.uses++
              res.lastUsed = this.msg.createdTimestamp
              resolve(res.save())
            }
          })
        }
      })
    })
  }
}
