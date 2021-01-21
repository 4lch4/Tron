const settings = require('./local.settings.json')

module.exports = {
  apps: [
    {
      name: 'Tron',
      script: './src/Tron.js',
      watch: false,
      env: {
        PORT: 3030,
        NODE_ENV: 'development',
        DISCORD_TOKEN: settings.test.discordToken,
        COMMAND_PREFIX: settings.test.commandPrefix,
        OWNER_ID: settings.test.ownerId
      }
    }
  ]
}
