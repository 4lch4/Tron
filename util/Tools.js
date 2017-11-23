const config = require('./config.json')
const moment = require('moment-timezone')

module.exports = class Tools {
  get formattedTime () {
    return moment.tz(config.defaultTimezone).format('MM.DD.Y @ HH:mm:ss')
  }

  get safeFormattedTime () {
    return moment.tz(config.defaultTimezone).format('MM.DD.Y_HH:mm:ss')
  }
}
