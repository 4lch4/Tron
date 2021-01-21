const settings = require('./local.settings.json')

module.exports = {
  apps: [
    {
      name: 'Tron',
      script: './src/index.js',
      watch: false,
      env: {
        PORT: 3030,
        NODE_ENV: 'development',
        DISCORD_TOKEN: settings.test.discordToken,
        COMMAND_PREFIX: settings.test.commandPrefix,
        OWNER_ID: settings.test.ownerId
      },
      env_production: {
        PORT: 3030,
        NODE_ENV: 'production',
        DISCORD_TOKEN: settings.prod.discordToken,
        COMMAND_PREFIX: settings.prod.commandPrefix,
        OWNER_ID: settings.prod.ownerId
      }
    }
  ]
}
