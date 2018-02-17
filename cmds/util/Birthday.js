const config = require('../../util/config.json')
const mongoose = require('mongoose')
const connection = mongoose.createConnection(config.mongoUrl)
const BirthdaySchema = new mongoose.Schema({
  _id: String,
  date: String,
  privateDate: Boolean
})

const BirthdayModel = connection.model('Birthday', BirthdaySchema, 'birthdays')

/**
 * @typedef {Object} Info
 * @prop {string} _id
 * @prop {string} date
 * @prop {boolean} privateDate
 */

class Birthday {
  constructor (userId, date = undefined, privateDate = true) {
    this.user = userId
    this.date = date
    this.privateDate = privateDate
  }

  /**
   * @returns {Promise<string>}
  */
  stored () {
    return new Promise((resolve, reject) => {
      BirthdayModel.findById(this.user, (err, res) => {
        if (err) reject(err)
        else if (res !== null) resolve(true)
        else resolve(false)
      })
    })
  }

  store (object = {_id: this.user, date: this.date, privateDate: this.privateDate}) {
    return new Promise((resolve, reject) => {
      const newBday = new BirthdayModel(object)
      newBday.save(err => {
        if (err) reject(err)
        else resolve(true)
      })
    })
  }

  /**
   * Gets the required info to be stored for a given birthday and returns it as an object.
   *
   * @param {*} msg
   * @returns {Promise<Info>}
   */
  async getInfo (msg) {
    return Promise.resolve({
      _id: msg.author.id,
      date: await this.getDate(msg),
      privateDate: await this.getPrivacy(msg)
    })
  }

  async getServerBdays (msg) {
    return new Promise((resolve, reject) => {
      BirthdayModel.find({privateDate: false}, (err, res) => {
        if (err) reject(err)
        else {
          let usernames = []

          res.forEach(val => {
            let member = msg.guild.members.get(val._id)
            if (member !== undefined) usernames.push({username: member.user.username, date: [val.date.slice(0, 2), '/', val.date.slice(2)].join('')})
          })

          resolve(usernames)
        }
      })
    })
  }

  getDate (msg) {
    return new Promise((resolve, reject) => {
      const collector = msg.channel.createMessageCollector(m => {
        return m.channel.id === msg.channel.id && m.author.id === msg.author.id
      }, { time: 25000 })

      msg.reply('which date is your birthday? (MMDD e.g. August 25 = 0825)')

      collector.on('collect', m => {
        if (m.content.match(/[0-9]{4}/)) {
          collector.stop()
          resolve(m.content)
        } else m.reply('date must be in MMDD format.')
      })
    })
  }

  getPrivacy (msg) {
    return new Promise((resolve, reject) => {
      const collector = msg.channel.createMessageCollector(m => {
        return m.channel.id === msg.channel.id && m.author.id === msg.author.id
      }, { time: 25000 })

      msg.reply('would you like your birthday to remain private?')

      collector.on('collect', m => {
        let content = m.content.toLowerCase()
        if (content === 'yes') {
          collector.stop()
          resolve(true)
        } else if (content === 'no') {
          collector.stop()
          resolve(false)
        } else m.reply('must provide yes or no.')
      })
    })
  }
}

module.exports = Birthday
