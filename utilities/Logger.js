"use strict"
const config = require('../config.json')
const moment = require('moment-timezone')
const chalk = require('chalk')

function clockstamp () {
  return ' >' + chalk.green.bold(moment().tz(config.defaultTimezone).format(' h:mm A MM/DD'))
}

class Logger {
  constructor (bg, title) {
    this.title = title
    this.bg = bg || 'bgWhite'
  }
  log (bg = this.bg, title = this.title, text) { console.log(`${chalk[bg].bold(` ${title || 'LOG'} `)} ${text}`) }
  bot (text) { console.log(`${chalk[this.bg].bold(` ${this.title} `)} ${text}`) }
  cmd (text) { console.log(`${chalk.bgCyan.bold(' CMD ')} ${text}`) }
  test (text) { console.log(`${chalk.bgRed.bold(' Testing ')} ${text}`) }
  eris (text) { console.log(`${chalk.bgGreen.bold(' Eris ')} ${text}`) }
  error (title = this.title + ' Error', text) { console.error(`${chalk.bgRed.bold(` ${title} `)} ${clockstamp()}\n${(text && text.stack) || text}`) }
  config () {
    console.log([
      `${chalk.bgCyan.bold(' Config ')} Number of Admins: ${config.adminids.length}`,
      `${chalk.bgCyan.bold(' Config ')} Current Timezone: ${config.defaultTimezone}`,
      `${chalk.bgCyan.bold(' Config ')} Default Game: ${config.defaultgame.join(' , ')}`
    ].join('\n'))
  }
  command (msg) {
    if (typeof msg === 'object') {
      console.log([
        `${chalk.bgYellow.bold(' Command ')}`,
        `${chalk.magenta.bold(msg.channel.guild ? msg.channel.guild.name : 'in PMs')} >`,
        `${chalk.cyan.bold(msg.author.username)}: ${msg.content}${clockstamp()}`
      ].join(' '))
    }
  }
}

module.exports = Logger
