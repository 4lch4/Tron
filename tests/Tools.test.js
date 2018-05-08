const { Client } = require('discord.js')
const Tools = require('../util/Tools')
const tools = new Tools()
const faker = require('')

const testDateFormat = 'MM_YYYY_DD.HH:mm:ss'
const formatTimeRegex = /[0-2]?[0-9]_\d{4}_[0-9]{2}.[0-2][0-9]:[0-6][0-9]:[0-6][0-9]/

test('The formatTime(format) function returns a properly formatted time.', () => {
  expect(tools.formatTime(testDateFormat)).toEqual(expect.stringMatching(formatTimeRegex))
})

// tools#formatUnixInput

// tools#formatUTCTime

// tools#pickImage

test('The shortLogDate property getter returns a proper short date for logging.', () => {
  let logDate = tools.shortLogDate

  expect(logDate).toMatch(/\d{4}-[0-1][0-9]-[0-2][0-9]/)
  expect(logDate).toHaveLength(10)
})

test('The shortUTCTime property getter returns a properly formatted UTC time.', () => {
  let utcTime = tools.shortUTCTime  // moment.tz(UTC).format('HH:mm:ss.SS')
  expect(utcTime).toMatch(/[0-2][0-9]:[0-6][0-9]:[0-6][0-9].[0-9][0-9]/);
  expect(utcTime).toHaveLength(11)
})

test('The formattedTime property getter returns a properly formatted date.', () => {
  expect(tools.formattedTime).toMatch(/[0-2]?.[0-9]{2}.\d{4} @ [0-2][0-9]:[0-6][0-9]:[0-6][0-9]/)
})

test('The utcTime property getter returns the correct UTC time.', () => {
  let toolTime = tools.utcTime
  let nodeTime = new Date().toISOString()
  let toolTimeStr = toolTime.substring(0, toolTime.indexOf('Z'))
  let nodeTimeStr = nodeTime.substring(0, nodeTime.indexOf('.'))

  expect(toolTimeStr).toMatch(nodeTimeStr)
})

test('The formattedUTCTime getter returns a properly formatted UTC time.', () => {
  expect(tools.formattedUTCTime).toMatch(/[0-1][0-9].[0-9]{2}.\d{4} @ [0-2][0-9]:[0-6][0-9]:[0-6][0-9]/)
})

test('The safeFormattedTime getter returns a safely formatted time.', () => {
  expect(tools.safeFormattedTime).toMatch(/[0-1][0-9].[0-9]{2}.\d{4}_[0-2][0-9]:[0-6][0-9]:[0-6][0-9]/)
})

test('The upperFirstC funcion capitalizes the first letter of the given string.', () => {
  expect(tools.upperFirstC("apollo")).toBe("Apollo")
});

test('The numberWithCommas function converts a number larger than 1,000 to contain commas.', () => {
  expect(tools.numberWithCommas(999888777666555)).toBe("999,888,777,666,555")
})

test('The getRandom(min, max) function gets a random number in the correct range.', () => {
  let random = tools.getRandom(0, 100)
  expect(random).toBeGreaterThanOrEqual(0)
  expect(random).toBeLessThan(100)
})

//tools.sendOwnerMessage("Haaiii", new Client())
