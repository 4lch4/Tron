const mongoose = require('mongoose')
const config = require('../config.json')

const ReminderSchema = mongoose.Schema({
  author: String,
  content: String,
  triggerTime: String
})

class Reminder {
  constructor (userId, reminderMsg) {
    this.connection = mongoose.createConnection(`${config.mongoUrl}/data`)
    this.userId = userId
    this.reminderMsg = reminderMsg
  }

  /**
   * @param {String} input
   */
  set userId (input) {
    this.userId = input
  }

  /**
   * @param {String} content
   */
  set content (content) {
    this._content = content
  }

  set triggerTime (triggerTime) {
    this.triggerTime = triggerTime
  }

  save () {
    const triggerDate = new Date()
  }
}

module.exports = Reminder
