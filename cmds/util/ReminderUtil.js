module.exports = class ReminderUtil {
  async parseUserInput (msg, args) {
    const parsedArgs = this.parseArgs(args)

    return {
      reminderMsg: parsedArgs.reminderMsg,
      userId: msg.author.id,
      triggerTime: this.getTriggerTime(parsedArgs)
    }
  }

  /**
   * Gets the time at which the reminder should be triggered.
   *
   * @param {Object} data The parsed args input
   */
  getTriggerTime (data) {
    const date = new Date()

    date.setDate(date.getDate() + data.days)
    date.setHours(date.getHours() + data.hours)
    date.setMinutes(date.getMinutes() + data.minutes)

    return date.getTime()
  }

  /**
   * Parses the user args and returns a prettier object that's easier to use.
   *
   * @param {String[]} args The args to parse.
   */
  parseArgs (args) {
    const timeArgs = this.getTimeArgs(args)

    return {
      reminderMsg: this.getReminderMsg(args),
      days: this.getTimeVal(['days', 'day'], timeArgs),
      hours: this.getTimeVal(['hours', 'hour'], timeArgs),
      minutes: this.getTimeVal(['minutes', 'minute'], timeArgs)
    }
  }

  /**
   *
   * @param {String[]} names
   * @param {String[]} args
   */
  getTimeVal (names, args) {
    for (let x = 0; x < args.length; x += 2) {
      if (names.includes(args[x + 1].toLowerCase())) return parseInt(args[x])
    }

    return 0
  }

  /**
   *
   * @param {String[]} args
   */
  getReminderMsg (args) {
    let index = args.findIndex(val => val.toLowerCase() === 'in')
    return args.slice(0, index).join(' ').trim()
  }

  /**
   *
   * @param {String[]} args
   */
  getTimeArgs (args) {
    let index = args.findIndex(val => val.toLowerCase() === 'in')
    return args.slice(index + 1).filter(val => val.toLowerCase() !== 'and')
  }
}
