const config = require('../../util/config.json')

/**
 * Retrieves a setting from Tron's configuration files or environment variables
 * using the provided settingName parameter and returns it via a Promise. If
 * none are found, undefined is returned via the Promise instead.
 * 
 * @param {String} settingName The name of the setting you want the value of.
 * 
 * @returns {Promise<String>|Promise<undefined>} Setting value, or undefined if none found
 */
module.exports.getSetting = settingName => {
  if (config[settingName] !== undefined) return config[settingName]
  else if (process.env[settingName] !== undefined) return process.env[settingName]
  else return undefined
}
