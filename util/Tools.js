const config = require('./config.json')
const moment = require('moment-timezone')
const Chance = require('chance')
const chance = new Chance()

module.exports = class Tools {
  get formattedTime () {
    return moment.tz(config.defaultTimezone).format('MM.DD.Y @ HH:mm:ss')
  }

  get safeFormattedTime () {
    return moment.tz(config.defaultTimezone).format('MM.DD.Y_HH:mm:ss')
  }

  /**
   * Returns a random integer between the min (inclusive) and max (exclusive).
   *
   * @param {*} min
   * @param {*} max
   */
  getRandom (min, max) {
    if (min < max) {
      return chance.integer({
        min: min,
        max: (max - 1)
      })
    } else {
      return 0
    }
  }
}
