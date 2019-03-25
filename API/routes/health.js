const { noFields } = require('./shared')
const prettyMs = require('pretty-ms')

const fieldNames = {
  'uptime': 'How long Tron has been online since the last reboot.'
}

/**
 * Handles any requests sent to the /health endpoint.
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
  } else return noFields(res, fieldNames)
}

/**
 * Gets data for the given field from the given bot client.
 *
 * @param {String} field The name of the field you wish to retrieve data for.
 * @param {CommandoClient} client The bot client for retrieving the data.
 */
const getFieldData = (field, client) => {
  switch (field) {
    case 'uptime': return { uptime: prettyMs(client.uptime) }

    default: return 'Field Not Found'
  }
}

module.exports = handleRequest

// #region JSDoc References
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
// #endregion JSDoc References
