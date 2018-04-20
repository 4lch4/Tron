const { Message } = require('discord.js') // Used for JSDocs
const config = require('../../util/config.json')
const mongoose = require('mongoose')
const connection = mongoose.createConnection(config.mongoUrl)
const BirthdaySchema = new mongoose.Schema({
  _id: String,
  date: String,
  privateDate: Boolean,
  creatorId: String
})

/**
 * @typedef {Object} Bday
 * @prop {string} _id
 * @prop {string} date
 * @prop {boolean} privateDate
 * @prop {string} creatorId
 */

const BirthdayModel = connection.model('Birthday', BirthdaySchema, 'birthdays')

const baseCollector = msg => {
  return msg.channel.createMessageCollector(m => {
    return m.channel.id === msg.channel.id && m.author.id === msg.author.id
  }, { time: 25000, max: 3, maxMatches: 1 })
}

/**
 * The birthday helper class for managing birthdays and the database entries
 * associated with them.
 */
class Birthday {
  /**
   * The default constructor for the Birthday class. It accepts three
   * parameters, two of which are optional as they may not be known at the time
   * of instantiating the class. The user id is mandatory as it's used for
   * nearly every database call and we can't chance it being undefined/null.
   *
   * @param {string} userId The user id of the user we're working with
   * @param {string} date The date of the users birthday if known
   * @param {boolean} privateDate Whether or not their birthday should be private
   *
   * @constructor
   */
  constructor (userId, date = undefined, privateDate = true) {
    this.user = userId
    this.date = date
    this.privateDate = privateDate
  }

  canModify (userId) {
    return new Promise((resolve, reject) => {
      if (userId === this.user) resolve(true)

      BirthdayModel.findById(this.user, (err, res) => {
        if (err) reject(err)
        else if (res.creatorId === userId) resolve(true)
        else resolve(false)
      })
    })
  }

  delete () {
    return new Promise((resolve, reject) => {
      BirthdayModel.deleteOne({ _id: this.user }, err => {
        if (err) reject(err)
        else resolve(true)
      })
    })
  }

  /**
   * Returns true or false depending on if the current birthday model has been
   * stored in the database yet. The database is queried for the user that was
   * provided when creating an instance of the Birthday class.
   *
   * @returns {Promise<boolean>}
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

  updateBirthday (info) {
    return new Promise((resolve, reject) => {
      BirthdayModel.findByIdAndUpdate(this.user, { date: info.date, privateDate: info.privateDate }, (err, res) => {
        if (err) reject(err)
        else resolve(true)
      })
    })
  }

  /**
   * If a birthday object is provided, it is stored in the birthdays collection
   * and returns true if it is successful. If no object is provided, it defaults
   * to the values provided when creating an instance of the Birthday class.
   *
   * @param {Bday} [bday] The birthday to be stored (defaults to values provided when creating the class)
   *
   * @return {Promise<boolean>}
   */
  store (bday = {_id: this.user, date: this.date, privateDate: this.privateDate}) {
    return new Promise((resolve, reject) => {
      const newBday = new BirthdayModel(bday)
      newBday.save(err => {
        if (err) reject(err)
        else resolve(true)
      })
    })
  }

  /**
   * Gets the required info to be stored for a given birthday and returns it as
   * an object.
   *
   * @param {Message} msg
   *
   * @returns {Promise<Bday>}
   */
  async getInfo (msg) {
    return Promise.resolve({
      _id: msg.author.id,
      date: await this.getDate(msg),
      privateDate: await this.getPrivacy(msg)
    })
  }

  async getOtherInfo (msg) {
    return Promise.resolve({
      _id: await this.getUserId(msg),
      date: await this.getOtherDate(msg),
      privateDate: await this.getOtherPrivacy(msg),
      creatorId: msg.author.id
    })
  }

  /**
   * Gets a list of all public birthdays on the server where the provided
   * message was sent.
   *
   * @param {Message} msg
   */
  async getServerBdays (msg) {
    return new Promise((resolve, reject) => {
      BirthdayModel.find({privateDate: false}, (err, res) => {
        if (err) reject(err)
        else {
          let bdays = []

          res.forEach(val => {
            let member = msg.guild.members.get(val._id)
            if (member !== undefined) bdays.push({username: member.user.username, date: this.formatDate(val.date)})
          })

          resolve(bdays)
        }
      })
    })
  }

  async getUserId (msg) {
    return new Promise((resolve, reject) => {
      const collector = baseCollector(msg)

      msg.reply('which user do you want to store a birthday for? Please reply with a mention of the user. (e.g. _@Alcha#2625_)')

      collector.on('collect', m => {
        if (m.mentions.users.size === 1) {
          collector.stop()
          resolve(m.mentions.users.first().id)
        } else m.reply('please mention at least one and only one, user.')
      })
    })
  }

  verifyNewUser (msg) {
    return new Promise((resolve, reject) => {
      const collector = baseCollector(msg)

      msg.reply('your birthday has already been stored. Would you like to add the birthday of another user? (**Y**/**N**)')

      collector.on('collect', m => {
        if (m.content.length === 1) {
          switch (m.content.toLowerCase()) {
            case 'y':
              collector.stop()
              resolve(true)
              break

            case 'n':
              collector.stop()
              resolve(false)
              break

            default:
              m.reply('please reply with the letter **Y** or **N**.')
              break
          }
        } else m.reply('please reply with the letter **Y** or **N**.')
      })
    })
  }

  /**
   * Gets the date of a users birthday using a message collector on the provided
   * message. If one is provided, it is returned via a Promise as a String.
   *
   * @param {Message} msg
   *
   * @returns {Promise<string>}
   */
  getOtherDate (msg) {
    return new Promise((resolve, reject) => {
      const collector = baseCollector(msg)

      msg.reply('which date is their birthday? (MMDD e.g. August 25 = **0825**)')

      collector.on('collect', m => {
        if (m.content.length === 4 && m.content.match(/[0-9]{4}/)) {
          collector.stop()
          resolve(m.content)
        } else m.reply('date must be in MMDD format (e.g. August 25 = **0825**).')
      })
    })
  }

  /**
   * Gets the privacy preference from the user using a message collector on the
   * provided message object. If it is provided, true or false is returned based
   * on their reply `(yes = true, no = false)`.
   *
   * @param {Message} msg
   *
   * @returns {Promise<boolean>}
   */
  getOtherPrivacy (msg) {
    return new Promise((resolve, reject) => {
      const collector = baseCollector(msg)

      msg.reply('would you like their birthday to remain private?')

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

  /**
   * Gets the date of a users birthday using a message collector on the provided
   * message. If one is provided, it is returned via a Promise as a String.
   *
   * @param {Message} msg
   *
   * @returns {Promise<string>}
   */
  getDate (msg) {
    return new Promise((resolve, reject) => {
      const collector = baseCollector(msg)

      msg.reply('which date is the birthday? (MMDD e.g. August 25 = **0825**)')

      collector.on('collect', m => {
        if (m.content.length === 4 && m.content.match(/[0-1]?[0-9][0-3][0-9]/)) {
          collector.stop()
          resolve(m.content)
        } else m.reply('date must be in MMDD format (e.g. August 25 = **0825**).')
      })
    })
  }

  /**
   * Gets the privacy preference from the user using a message collector on the
   * provided message object. If it is provided, true or false is returned based
   * on their reply `(yes = true, no = false)`.
   *
   * @param {Message} msg
   *
   * @returns {Promise<boolean>}
   */
  getPrivacy (msg) {
    return new Promise((resolve, reject) => {
      const collector = baseCollector(msg)

      msg.reply('would you like the birthday to remain private?')

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

  /**
   * "Formats" the given 4 digit date by adding a / between them. For example,
   * passing in the digits "0825" will return "08/25" for better reading.
   *
   * @param {string} date The date to be formatted
   */
  formatDate (date) {
    /* let output = []
    output.push(date[0])
    output.push(date[1])
    output.push('/')
    output.push(date[2])
    output.push(date[3]) */
    return [date.slice(0, 2), '/', date.slice(2)].join('')
  }
}

module.exports = Birthday
