const { join } = require('path')
const dataPath = '../../data/OWL'
const logosPath = join(dataPath, 'Team_Logos')

module.exports.schedule = require(join(dataPath, '2019-01_Schedule.json'))
module.exports.logosPath = logosPath
module.exports.logos = {
  reign: {
    name: 'Atlanta Reign',
    path: join(logosPath, 'Atlanta_Reign.svg')
  },
  uprising: {
    name: 'Boston Uprising',
    path: join(logosPath, 'Boston_Uprising.svg')
  },
  hunters: {
    name: 'Chengdu Hunters',
    path: join(logosPath, 'Chengdu_Hungers.svg')
  },
  fuel: {
    name: 'Dallas Fuel',
    path: join(logosPath, 'Dallas_Fuel.svg')
  },
  mayhem: {
    name: 'Florida Mayhem',
    path: join(logosPath, 'Florida_Mayhem.svg')
  },
  charge: {
    name: 'Guangzhou Charge',
    path: join(logosPath, 'Guangzhou_Charge.svg')
  },
  spark: {
    name: 'Hangzhou Spark',
    path: join(logosPath, 'Hangzhou_Spark.svg')
  },
  outlaws: {
    name: 'Houston Outlaws',
    path: join(logosPath, 'Houston_Outlaws.svg')
  },
  spitfire: {
    name: 'London Spitfire',
    path: join(logosPath, 'London_Spitfire.svg')
  },
  gladiators: {
    name: 'Los Angeles Gladiators',
    path: join(logosPath, 'Los_Angeles_Gladiators.svg')
  },
  valiant: {
    name: 'Los Angeles Valiant',
    path: join(logosPath, 'Los_Angeles_Valiant.svg')
  },
  excelsior: {
    name: 'New York Excelsior',
    path: join(logosPath, 'New_York_Excelsior.svg')
  },
  eternal: {
    name: 'Paris Eternal',
    path: join(logosPath, 'Paris_Eternal.svg')
  },
  fusion: {
    name: 'Philadelphia Fusion',
    path: join(logosPath, 'Philadelphia_Fusion.svg')
  },
  shock: {
    name: 'San Francisco Shock',
    path: join(logosPath, 'San_Francisco_Shock.svg')
  },
  dynasty: {
    name: 'Seoul Dynasty',
    path: join(logosPath, 'Seoul_Dynasty.svg')
  },
  dragons: {
    name: 'Shanghai Dragons',
    path: join(logosPath, 'Shanghai_Dragons.svg')
  },
  titans: {
    name: 'Vancouver Titans',
    path: join(logosPath, '')
  },
  justice: {
    name: 'Washington Justice',
    path: join(logosPath, '')
  }
}
