const config = require('../../util/config.jsonc')

/**
 * Retrieves a setting from Tron's configuration files or environment variables
 * using the provided settingName parameter and returns it via a Promise. If
 * none are found, undefined is returned via the Promise instead.
 *
 * @param {String} settingName The name of the setting you want the value of.
 *
 * @returns {String|undefined} Setting value, or undefined if none found
 */
const getSetting = settingName => {
  if (config[settingName] !== undefined) return config[settingName]
  else if (process.env[settingName] !== undefined) return process.env[settingName]
  else return undefined
}

/**
 * Checks Tron's configuration to see if the given user id is either a noted
 * beta test or is a developer. If they are, true is returned, otherwise false
 * is returned.
 *
 * @param {String} userId The id of the user you're checking access for
 *
 * @returns {Boolean} True or false, is the user a tester?
 */
const isBetaTester = userId => {
  if (config.betaTesters.includes(userId)) return true
  else if (config.developers.includes(userId)) return true
  else return false
}

module.exports.getSetting = getSetting
module.exports.isBetaTester = isBetaTester
