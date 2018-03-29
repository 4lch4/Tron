const mongoose = require('mongoose')
const baseUri = 'mongodb://localhost'

const colors = require('../../util/colors').Decimal
const tools = new (require('../../util/Tools'))()

const userSchema = mongoose.Schema({
  _id: String,
  married: Boolean,
  divorced: Boolean,
  anniversary: String
})

class Marriage {
  constructor (proposee, proposer) {
    if (proposer !== undefined) {
      this.proposee = proposee
      this.proposer = proposer
    } else this.proposee = proposee

    this.connection = mongoose.createConnection(`${baseUri}/${proposee}`)
  }

  married () {
    return new Promise((resolve, reject) => {
      const marriage = this.connection.model('Marriage', userSchema, 'marriages')

      marriage.count({_id: this.proposer, married: true, divorced: false}, function (err, count) {
        if (err) reject(err)
        else if (count > 0) resolve(true)
        else resolve(false)
      })
    })
  }

  divorced () {
    return new Promise((resolve, reject) => {
      const marriage = this.connection.model('Marriage', userSchema, 'marriages')

      marriage.count({_id: this.proposer, married: false, divorced: true}, function (err, count) {
        if (err) reject(err)
        else if (count > 0) resolve(true)
        else resolve(false)
      })
    })
  }

  saveDivorce () {
    const ProposeeDb = mongoose.createConnection(`${baseUri}/${this.proposee}`)
    const ProposerDb = mongoose.createConnection(`${baseUri}/${this.proposer}`)

    const ProposeeDbModel = ProposeeDb.model('Marriage', userSchema, 'marriages')
    const ProposerDbModel = ProposerDb.model('Marriage', userSchema, 'marriages')

    return new Promise((resolve, reject) => {
      ProposerDbModel.update({_id: this.proposee}, {
        married: false,
        divorced: true,
        anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
      }).then(res => {
        ProposeeDbModel.update({_id: this.proposer}, {
          married: false,
          divorced: true,
          anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
        }).then(res => resolve()).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }

  saveMarriage () {
    const ProposeeDb = mongoose.createConnection(`${baseUri}/${this.proposee}`)
    const ProposerDb = mongoose.createConnection(`${baseUri}/${this.proposer}`)

    const ProposeeDbModel = ProposeeDb.model('Marriage', userSchema, 'marriages')
    const ProposerDbModel = ProposerDb.model('Marriage', userSchema, 'marriages')

    return new Promise((resolve, reject) => {
      ProposerDbModel.update({_id: this.proposee}, {
        married: true,
        divorced: false,
        anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
      }, { upsert: true }).then(res => {
        ProposeeDbModel.update({_id: this.proposer}, {
          married: true,
          divorced: false,
          anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
        }, { upsert: true }).then(res => resolve()).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }

  /**
   * Creates a message collector in the provided channel and waits for a reply from the provided user.
   * If a yes (true) or no (false) answer is received from the user, the collector is stopped, and the
   * response is returned via a Promise as a Boolean.
   *
   * A number can be provided as the timeout parameter if you wish to modify the default limit of 60.
   * After the duration of the timeout period, the collector will stop itself and return an error with
   * the message time.
   *
   * @param {*} channel - The channel where the proposal was made
   * @param {*} userId - The mentioned user id who is being proposed to
   * @param {number} [timeout=60] - How long to wait for a response in seconds
   *
   * @returns {Promise<boolean>} True or false, was the proposal accepted
   */
  getProposalResponse (channel, userId, timeout = 60) {
    return new Promise((resolve, reject) => {
      const collector = channel.createMessageCollector(m =>
        m.member.id === userId && m.channel.id === channel.id,
        { time: timeout * 1000 })

      // When a message is collected, determine if it is a yes or no
      collector.on('collect', (m, c) => {
        // If the user replies with a yes, stop the collector, and return true
        if (m.content.trim().toLowerCase() === 'yes') {
          resolve(true)
          collector.stop()
        } else if (m.content.trim().toLowerCase() === 'no') {
          // If the user replies with a no, stop the collector, and return false
          resolve(false)
          collector.stop()
        }
      })

      collector.on('end', (c, r) => {
        if (r === 'time') reject(r)
        else if (r === 'user') resolve(true)
        else {
          console.error('The proposal response collector has ended unexpectedly...', r)
          resolve(false)
        }
      })
    })
  }

  complete () {
    this.connection.close()
    this.proposee = undefined
    this.proposer = undefined
  }

  /**
   * Retrieves the current marriages of the provided user (if any exist) as well as the anniversary of
   * the marriage.
   */
  getMarriedList () {
    const marriages = this.connection.model('Marriage', userSchema, 'marriages')

    return new Promise((resolve, reject) => {
      marriages.find({ married: true }, (err, res) => {
        if (err) reject(err)
        else {
          let list = []

          res.forEach(val => {
            list.push({
              id: val._id,
              anniversary: val.anniversary
            })
          })

          resolve(list)
        }
      })
    })
  }

  getDivorcedList () {
    const marriages = this.connection.model('Marriage', userSchema, 'marriages')

    return new Promise((resolve, reject) => {
      marriages.find({ divorced: true }, (err, res) => {
        if (err) reject(err)
        else {
          let list = []

          res.forEach(val => {
            list.push({
              id: val._id,
              anniversary: val.anniversary
            })
          })

          resolve(list)
        }
      })
    })
  }

  /**
   * Converts the given list of user ids to their current username/nickname and adds it to an inline
   * field object with the initial date/anniversary of the marriage as the value.
   *
   * @param {string[]} idList - An array containing the user ids and marriage dates
   * @param {*} client - The Discord.js client which is used to convert user ids to usernames
   */
  convertIdsToFields (idList, client) {
    const imgList = ['💕', '❤', '💛', '💚', '💙', '💜', '🧡', '🧡', '🧡']
    let fieldsOut = []

    return new Promise((resolve, reject) => {
      for (let x = 0; x < 9; x++) {
        if (idList[x] !== undefined) {
          let user = client.users.get(idList[x].id)
          if (user !== undefined) {
            fieldsOut.push({
              'name': `${imgList[x]} ${user.username}`,
              'value': `*- ${idList[x].anniversary.substring(0, 10)}*`,
              'inline': true
            })
          }
        }
      }

      resolve(fieldsOut)
    })
  }

  generateDivorcedListEmbed (username, fields, client) {
    return new Promise((resolve, reject) => {
      if (fields.length !== 0) {
        resolve({
          embed: {
            color: colors.red.P500,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL()
            },
            description: `A list of divorces and their anniversary for ${username}.`,
            fields: fields
          }
        })
      } else {
        resolve({ content: 'This user currently has no divorces.' })
      }
    })
  }

  generateMarriedListEmbed (username, fields, client) {
    return new Promise((resolve, reject) => {
      if (fields.length !== 0) {
        resolve({
          embed: {
            color: colors.red.P500,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL()
            },
            description: `A list of marriages and their anniversary for ${username}.`,
            fields: fields
          }
        })
      } else {
        resolve({ content: 'This user currently has no marriages. :cry:' })
      }
    })
  }
}

module.exports = Marriage
