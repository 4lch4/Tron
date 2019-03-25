const { noFields } = require('./shared')

const fields = {
  'users': 'The total number of users that Tron has cached at any point.',
  'guilds': 'The total number of guilds that Tron is a member of.',
  'emojis': 'The total number of custom emojis that Tron has access to.',
  'owners': 'The amount of owners Tron has.'
}

/**
 * Handles any requests passed to the /count endpoint.
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
    // Users count
    case 'users': return { users: client.users.size }

    // Guilds/Servers count
    case 'guilds':
    case 'servers': return { guilds: client.guilds.size }

    // Emoji count
    case 'emojis': return { emojis: client.emojis.size }

    // Owner count
    case 'owners': return { owners: client.owners.length }

    default: return 'Field Not Found'
  }
}

module.exports = handleRequest

// #region JSDoc References
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
// #endregion JSDoc References
