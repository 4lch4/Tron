const { noFields } = require('./shared')

const fields = {
  shards: 'The total number of shards in use by Tron at the moment.',
  messageCacheMaxSize: [
    'Maximum number of messages to cache per channel (-1 or Infinity for unlimited',
    "- don't do this without message sweeping, otherwise memory usage will climb indefinitely)"
  ].join(' '),
  messageCacheLifetime: 'How long a message should stay in the cache until it is considered sweepable (in seconds, 0 for forever)',
  presence: 'Presence data to use upon login.',
  httpVersion: 'API version to use.',
  httpApiUrl: 'Base URL of the Discord API.',
  httpCdnUrl: 'Base URL of the Discord CDN.',
  httpInviteUrl: 'Base URL of Discord invites.',
  avatarUrl: 'Get the URL for the bot avatar.'
}

/**
 * Handles any requests passed to the /client endpoint.
 *
 * @param {express.request} req
 * @param {express.response} res
 * @param {CommandoClient} client
 */
const handleRequest = (req, res, client) => {
  if (req.body.fields) {
    let output = []

    for (let field of req.body.fields) {
      output.push(getFieldData(field, client))
    }

    res.send(output)
  } else return noFields(res, fields)
}

/**
 * Gets data for the given field from the given bot client.
 *
 * @param {String} field The name of the field you wish to retrieve data for.
 * @param {CommandoClient} client The bot client for retrieving the data.
 */
const getFieldData = (field, client) => {
  switch (field) {
    case 'shards': return { shards: client.options.totalShardCount }
    case 'messageCacheMaxSize': return { messageCacheMaxSize: client.options.messageCacheMaxSize }
    case 'messageCacheLifetime': return { messageCacheLifetime: client.options.messageCacheLifetime }
    case 'presence': return { presence: client.user.presence }
    case 'httpVersion': return { httpVersion: client.options.http.version }
    case 'httpApiUrl': return { httpVersion: client.options.http.api }
    case 'httpCdnUrl': return { httpVersion: client.options.http.cdn }
    case 'httpInviteUrl': return { httpVersion: client.options.http.invite }
    case 'avatarUrl': return { avatarUrl: client.user.avatarURL() }
    case 'createdAt': return { createdAt: client.user.createdAt }
    case 'createdTimestamp': return { createdTimestamp: client.user.createdTimestamp }
    case 'defaultAvatarUrl': return { defaultAvatarURL: client.user.defaultAvatarURL }
    case 'locale': return { locale: client.user.locale }
    case 'tag': return { tag: client.user.tag }

    default: return 'Field Not Found'
  }
}

module.exports = handleRequest

// #region JSDoc References
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
// #endregion JSDoc References
