const chalk = require('chalk').default
const fs = require('fs-extra')
const path = require('path')
const tools = new (require('./Tools'))()

const INFO_LOG_PATH = path.join(__dirname, '../logs', `${tools.shortLogDate}-info.txt`)
const WARN_LOG_PATH = path.join(__dirname, '../logs', `${tools.shortLogDate}-warn.txt`)
const ERROR_LOG_PATH = path.join(__dirname, '../logs', `${tools.shortLogDate}-error.txt`)

const appendLogString = (log, info) => {
  if (fs.existsSync(log)) return fs.appendFile(log, `${tools.shortUTCTime} - ${info}\n`)
  else {
    fs.createFile(log).then(() => fs.appendFile(log, `${tools.shortUTCTime} - ${info}\n`))
  }
}

class Logger {
  /**
   * Accepts info as a string to be output to the info channels.
   *
   * @param {string} info
   */
  info (info) {
    console.info(`${chalk.blueBright(`INFO`)} - ${info}`)
    appendLogString(INFO_LOG_PATH, info)
    return this
  }

  /**
   * Accepts an error object to be output to the error channels and files.
   *
   * @param {Error} error
   */
  error (error) {
    console.error(`${chalk.redBright(`ERR`)} - ${error.message}`)
    console.error(error.stack)
    appendLogString(ERROR_LOG_PATH, error.message)
    appendLogString(ERROR_LOG_PATH, error.stack)
    return this
  }

/**
 * Accepts a string as input to be sent to the necessary warning channels and files.
 * @param {string} info information to be sent to warning channels
 */
  warn (warning) {
    console.warn(`${chalk.yellowBright('WARN')} - ${warning}`)
    appendLogString(WARN_LOG_PATH, warning)
    return this
  }
}

module.exports = Logger
