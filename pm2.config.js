const config = require('./util/config.json')

module.exports = {
  apps: [{
    name: 'Tron',
    script: './Tron.js',
    watch: false,
    env: {
      NODE_ENV: 'development',
      DISCORD_KEY: config.betaToken,
      CMD_PREFIX: config.betaPrefix,
      GIPHY_KEY: config.giphyKey
    },
    env_production: {
      NODE_ENV: 'production',
      DISCORD_KEY: config.prodToken,
      CMD_PREFIX: config.prodPrefix,
      GIPHY_KEY: config.giphyKey
    }
  }]
}
