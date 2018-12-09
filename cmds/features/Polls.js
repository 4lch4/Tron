const Command = require('../BaseCmd')
const Message = require('discord.js').Message // Used for JSDocs
// const Survey = require('survaid')
const Strings = require('../util/Strings').enUS
const { isBetaTester } = require('../util/Config')

/**
 * Contains the possible actions that can be performed by the Poll(s) command.
 */
const actions = {
  /** Indicates a user wishes to create a poll. */
  create: 'create',

  /** Indicates a user wishes to vote in an existing poll. */
  vote: 'vote',

  /** Indicates a user wishes to see the polls on their server. */
  list: 'list'
}

/**
 *
 * @param {String[]} args
 */
const determineAction = args => {
  switch (args[0].toLowerCase()) {
    case actions.create: return actions.create
    case actions.list: return actions.list
    case actions.vote: return actions.vote

    default: return undefined
  }
}

/**
 * Get the question/message for the poll and return it via a Promise.
 *
 * @param {Message} msg The original message that called the command.
 *
 * @returns {Promise<String>|Promise<undefined>} The response from the user wrapped in a Promise.
 */
const getPollMsg = async msg => {
  // Send the message requesting the question/message
  await msg.reply(Strings.polls.getPollMsg)

  // Return the response from the user
  return Command.getResponse(msg, val => val.length > 0, msg.author.id)
}

/** An enum for the various types of timing available. */
const timingTypes = {
  startOnly: 0,
  endOnly: 1,
  both: 2,
  neither: 3
}

/**
 * Gets the type of timing for the poll. Does it have a start or end time? Just
 * an end time? Just a start time?
 *
 * @param {Message} msg
 *
 * @returns {Promise<Number>|Promise<undefined>}
 */
const getTimingType = async msg => {
  await msg.reply(Strings.polls.getTimingType)
  return Command.getResponse(msg, val => val >= 0 && val <= 3, msg.author.id, Strings.polls.invalidTimingType)
}

class Poll extends Command {
  constructor (client) {
    super(client, {
      name: 'poll',
      group: 'features',
      memberName: 'poll',
      throttling: { usages: 1, duration: 10 },
      description: 'Allows you to create your own polls or vote in existing ones.',
      guildOnly: false,
      aliases: ['polls', 'survey', 'surveys'],
      argsType: 'multiple'
    })
  }

  /**
   * Steps to get a proper poll setup:
   *
   * 1) Get responses to the needed fields:
   *  - Title/Label/Question
   *  - Start Time of Poll
   *  - End Time of Poll
   *  - Is any input allowed or are there prefilled options?
   *    - If there are options to choose from, get the options
   *  - Can users vote more than once?
   * 2) Store that data and announce the poll is available.
   * 3) Enable other users to vote on the survey if they're in the same server.
   *
   * @param {Message} msg
   * @param {String[]} [args]
   *
   * @returns {Promise<Message>}
   */
  async run (msg, args) {
    if (isBetaTester(msg.author.id)) {
      switch (args.length) {
        case 0: return msg.reply(Strings.polls.noArgs)
        case 1: return handleSingleArg(msg, args)
      }
    } else return msg.reply(Strings.standard.underDevelopment)
  }
}

const dateRegex = /[0-2][0-9]-[0-3][0-9]-[0-9][0-9] [0-2][0-9]:[0-6][0-9]/
const moment = require('moment-timezone')

/**
 * Gets both the start and end times for a poll. Validates the input using regex
 * and returns both of them via a Promise.
 *
 * @param {Message} msg The object of the message that was sent to run the command.
 *
 * @returns {BothTimes} The start and end times for the poll as an object.
 *
 * @see https://www.timeanddate.com/worldclock/converter.html?iso=20181018T150000&p1=1440
 */
const getBothTimes = async msg => {
  await msg.reply('what is the date and time when the poll should open? (MM-dd-yy HH:mm e.g. 04-20-18 16:20)')
  let startTime = await Command.getResponse(msg, val => dateRegex.test(val), msg.author.id, Strings.polls.invalidDateInput)

  if (startTime !== undefined) {
    await msg.reply('what is the date and time when the poll should close? (MM-dd-yy HH:mm e.g. 04-21-18 16:20)')
    let endTime = await Command.getResponse(msg, val => dateRegex.test(val), msg.author.id, Strings.polls.invalidDateInput)

    return {
      startTime: startTime,
      endTime: endTime
    }
  } else return undefined
}

/**
 * Handles when a user only provides one argument. Such as +polls vote or
 * +polls create.
 *
 * @param {Message} msg The message object sent to run the command.
 * @param {String[]} args The arguments provided to the command.
 */
const handleSingleArg = async (msg, args) => {
  const timezone = await getCorrectTimezone(msg, convertRegionToTimezone(msg.guild.region))
  console.log(`timezone = `)
  console.log(timezone)
  // switch (determineAction(args)) {
  //   case actions.create: {
  //     // Get the necessary fields from the user and create a poll
  //     // Start with the poll question/message
  //     const question = await getPollMsg(msg)

  //     if (question !== undefined) {
  //       const timing = parseInt(await getTimingType(msg))

  //       // Based on the timing type, determine what input is needed next
  //       switch (timing) {
  //         case timingTypes.both: {
  //           if (msg.guild !== undefined) var offset = convertRegionToOffset(msg.guild.region)
  //           else offset = 'Unknown'
  //           const bothTimes = await getBothTimes(msg)

  //           let startTime = bothTimes.startTime
  //           let endTime = bothTimes.endTime

  //           let tz = await getTimezone(msg, offset)
  //         }
  //       }
  //     }

  //     break
  //   }

  //   case actions.vote: {
  //     // Get the survey they want to vote on and what they wanted to vote
  //     break
  //   }

  //   case actions.list: {
  //     // List the available surveys on the given server
  //     break
  //   }
  // }
}

const Timezones = require('../../data/Timezones.json')

const getCorrectTimezone = async (msg, timezone) => {
  const reply = `what is the timezone this poll will be hosted in? Our current best guess is "**${timezone.abbr}**".\n\n` +
                `If this is incorrect, please provide the correct timezone. Otherwise, simply reply with "correct".\n\n` +
                `If you're unsure what your timezone is, you can visit https://www.timeanddate.com/worldclock/converter.html \nInput your city name and it will show you **UTC** -/+ a number, the - or + and the number is your offset (e.g. **-7** for PDT/West Coast USA).`

  // const offsetRegex = /[+|-]?[0-9]?[0-4]?$|correct/i

  /** @param {String} input */
  const validateTimezoneInput = input => {
    for (let x = 0; x < Timezones.length; x++) {
      if (getTimezone(input) !== undefined) return true
    }
  }

  await msg.reply(reply)
  let response = await Command.getResponse(msg, val => validateTimezoneInput(val), msg.author.id, "Please provide a valid timezone. If you're unsure, please visit https://www.timeanddate.com/worldclock/converter.html.")
  return getTimezone(response)
}

const getTimezone = input => {
  for (let x = 0; x < Timezones.length; x++) {
    let tz = Timezones[x]
    if (tz.offset === input || tz.label === input || tz.abbr === input) return tz
  }

  return undefined
}

/**
 * A collection of Discord regions and their assumed timezone with a Markdown
 * formatted label for display and UTC offset for conversion purposes.
 */
const regions = {
  'eu-central': {
    offset: '+2',
    label: '**CEST** (UTC +2)'
  },
  'london': {
    offset: '+1',
    label: '**BST** (UTC +1)'
  },
  'amsterdam': {
    offset: '+2',
    label: '**CEST** (UTC +2)'
  },
  'japan': {
    offset: '+9',
    label: '**JST** (UTC +9)'
  },
  'brazil': {
    offset: '-3',
    label: '**BRT** (UTC -3)'
  },
  'us-west': {
    offset: '-7',
    label: '**PST** (UTC -7)'
  },
  'hongkong': {
    offset: '+8',
    label: '**HKT** (UTC +8)'
  },
  'southafrica': {
    offset: '+2',
    label: '**SAST** (UTC +2)'
  },
  'sydney': {
    offset: '+11',
    label: '**AEDT** (UTC +11)'
  },
  'singapore': {
    offset: '+8',
    label: '**SGT** (UTC +8)'
  },
  'us-central': {
    offset: '-5',
    label: '**CDT** (UTC -5)'
  },
  'eu-west': {
    offset: '+1',
    label: '**WEST** (UTC +1)'
  },
  'us-south': {
    offset: '-5',
    label: '**CDT** (UTC -5)'
  },
  'us-east': {
    offset: '-4',
    label: '**EDT** (UTC -4)'
  },
  'frankfurt': {
    offset: '+2',
    label: '**CEST** (UTC +2)'
  },
  'russia': {
    offset: '+3',
    label: '**MSK** (UTC +3)'
  }
}

/**
 * Converts the given region String to it's most likely timezone's UTC offset.
 *
 * @param {String} region The region String returned from Discord you wish to convert.
 *
 * @returns {Region}
 */
const convertRegionToTimezone = region => {
  return regions[region]
}

module.exports = Poll

/**
 * @typedef {Object} BothTimes
 * @property {String} startTime The date & time when the poll will open.
 * @property {String} endTime The date & time when the poll will close.
 */

/**
 * @typedef {Object} Region
 * @prop {String} offset The UTC offset of the regions timezone.
 * @prop {String} label The Markdown formatted label of the timezone.
 */
