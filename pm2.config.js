const config = require('./util/config.jsonc')

module.exports = {
  apps: [{
    name: 'Tron',
    script: './Tron.js',
    watch: false,
    env: {
      NODE_ENV: 'development',
      DISCORD_KEY: config.beta.token,
      CMD_PREFIX: config.beta.prefix,
      GIPHY_KEY: config.giphyKey,
      TIMBER_KEY: config.timberDev
    },
    env_production: {
      NODE_ENV: 'production',
      DISCORD_KEY: config.prod.token,
      CMD_PREFIX: config.prod.prefix,
      GIPHY_KEY: config.giphyKey,
      TIMBER_KEY: config.timber
    }
  }]
}
