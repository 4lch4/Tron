const config = require('./util/config.json')

module.exports = {
  apps: [{
    name: 'Porita',
    script: './Tron.js',
    watch: false,
    env: {
      PORT: 3030,
      NODE_ENV: 'development',
      DISCORD_KEY: config.beta.token,
      CMD_PREFIX: config.beta.prefix,
      GIPHY_KEY: config.giphyKey,
      TIMBER_KEY: config.timberDev
    },
    env_production: {
      PORT: 3000,
      NODE_ENV: 'production',
      DISCORD_KEY: config.prod.token,
      CMD_PREFIX: config.prod.prefix,
      GIPHY_KEY: config.giphyKey,
      TIMBER_KEY: config.timber
    }
  }]
}
