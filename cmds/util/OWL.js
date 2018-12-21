const { join } = require('path')
const dataPath = '/home/alcha/tron/data/OWL'
const logosPath = join(dataPath, 'Team_Logos')
const scheduleData = join(dataPath, '2019-01_Schedule.json')

// #region Helper Data
const teamNames = [
  'Atlanta Reign',
  'Boston Uprising',
  'Chengou Hunters',
  'Dallas Fuel',
  'Florida Mayhem',
  'Guangzhou Charge',
  'Hangzhou Spark',
  'Houston Outlaws',
  'London Spitfire',
  'Los Angeles Gladiators',
  'Los Angeles Valiant',
  'New York Excelsior',
  'Paris Eternal',
  'Philadelphia Fusion',
  'San Francisco Shock',
  'Seoul Dynasty',
  'Shanghai Dragons',
  'Toronto Defiant',
  'Vancouver Titans',
  'Washington Justice'
]

const teamLogos = {
  reign: {
    name: 'Atlanta Reign',
    path: join(logosPath, 'Atlanta_Reign.png')
  },
  uprising: {
    name: 'Boston Uprising',
    path: join(logosPath, 'Boston_Uprising.png')
  },
  hunters: {
    name: 'Chengdu Hunters',
    path: join(logosPath, 'Chengdu_Hungers.png')
  },
  fuel: {
    name: 'Dallas Fuel',
    path: join(logosPath, 'Dallas_Fuel.png')
  },
  mayhem: {
    name: 'Florida Mayhem',
    path: join(logosPath, 'Florida_Mayhem.png')
  },
  charge: {
    name: 'Guangzhou Charge',
    path: join(logosPath, 'Guangzhou_Charge.png')
  },
  spark: {
    name: 'Hangzhou Spark',
    path: join(logosPath, 'Hangzhou_Spark.png')
  },
  outlaws: {
    name: 'Houston Outlaws',
    path: join(logosPath, 'Houston_Outlaws.png')
  },
  spitfire: {
    name: 'London Spitfire',
    path: join(logosPath, 'London_Spitfire.png')
  },
  gladiators: {
    name: 'Los Angeles Gladiators',
    path: join(logosPath, 'Los_Angeles_Gladiators.png')
  },
  valiant: {
    name: 'Los Angeles Valiant',
    path: join(logosPath, 'Los_Angeles_Valiant.png')
  },
  excelsior: {
    name: 'New York Excelsior',
    path: join(logosPath, 'New_York_Excelsior.png')
  },
  eternal: {
    name: 'Paris Eternal',
    path: join(logosPath, 'Paris_Eternal.png')
  },
  fusion: {
    name: 'Philadelphia Fusion',
    path: join(logosPath, 'Philadelphia_Fusion.png')
  },
  shock: {
    name: 'San Francisco Shock',
    path: join(logosPath, 'San_Francisco_Shock.png')
  },
  dynasty: {
    name: 'Seoul Dynasty',
    path: join(logosPath, 'Seoul_Dynasty.png')
  },
  dragons: {
    name: 'Shanghai Dragons',
    path: join(logosPath, 'Shanghai_Dragons.png')
  },
  titans: {
    name: 'Vancouver Titans',
    path: join(logosPath, 'Vancouver_Titans.png')
  },
  justice: {
    name: 'Washington Justice',
    path: join(logosPath, 'Washington_Justice.png')
  }
}
// #endregion Helper Data

// #region Helper Functions
/**
 * Retrieves the schedule for a given team over the 2019 schedule.
 *
 * @param {String} team The name of the team you wish to retrieve.
 */
const getTeamSchedule = team => {
  let scheduleData = require('../../data/OWL/2019-01_Schedule.json')
  console.log(scheduleData)
}

/**
 * Formats the team names for output as a list.
 *
 * @returns {String}
 */
const formatTeamOutput = () => {
  let output = ''

  for (let x = 0; x < teamNames.length; x++) {
    output += `**${x})** \`${teamNames[x]}\`\n`
  }

  return output
}

/**
 * Parses the given team arg and returns the proper value. For example, if the
 * user does `+owl 0`, it returns the first team in the list, currently the
 * **Atlanta Reign**. If they do `+owl Houston Outlaws`, it simply returns
 * `Houston Outlaws`, since it's a valid team name.
 *
 * @param {String|Number} val The team arg to be parsed.
 *
 * @returns {String}
 */
const parseTeamArg = val => {
  if (isNaN(val)) {
    return val
  } else return teamNames[val]
}

/**
 * Validates the given team argument to ensure only valid input is provided.
 * Valid input includes a full team name such as `Houston Outlaws`, the number
 * of the team, such as `0` for the first team in the list, or `list` to list
 * all of the available teams.
 *
 * @param {String|Number} val The team arg value to be validated.
 *
 * @returns {boolean|String}
 */
const validateTeamArg = val => {
  if (teamNames.includes(val) ||
      val.toLowerCase() === 'list' ||
      (val >= 0 && val < teamNames.length)) return true
  else return 'Please provide a valid team name, including their city, or `list` to list available team names.'
}
// #endregion Helper Functions

// #region Module Exports
module.exports.teamNames = teamNames
module.exports.logosPath = logosPath
module.exports.teamLogos = teamLogos
module.exports.schedule = scheduleData
module.exports.parseTeamArg = parseTeamArg
module.exports.validateTeamArg = validateTeamArg
module.exports.getTeamSchedule = getTeamSchedule
module.exports.formatTeamOutput = formatTeamOutput
// #endregion Module Exports
