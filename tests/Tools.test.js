const { Client } = require('discord.js')
const Tools = require('../util/Tools')
const tools = new Tools()
const faker = require('')

const testDateFormat = 'MM_YYYY_DD.HH:mm:ss'
const testDateRegex = /[0-2]?[0-9]_\d{4}_[0-9]{2}.[0-2][0-9]:[0-6][0-9]:[0-6][0-9]/

test('The utcTime property getter returns the correct UTC time.', () => {
  let toolTime = tools.utcTime
  let nodeTime = new Date().toISOString()
  let toolTimeStr = toolTime.substring(0, toolTime.indexOf('Z'))
  let nodeTimeStr = nodeTime.substring(0, nodeTime.indexOf('.'))

  expect(toolTimeStr).toEqual(expect.stringMatching(nodeTimeStr))
})

test('The formatTime() function returns a properly formatted time.', () => {
  expect(tools.formatTime(testDateFormat)).toEqual(expect.stringMatching(testDateRegex))
})

test('The...', () => {
  
});

test('', () => {
  
});

// tools.shortUTCTime

test('The formattedTime property getter returns a properly formatted date.', () => {
  expect(tools.formattedTime).toEqual(expect.stringMatching(/[0-2]?.[0-9]{2}.\d{4} @ [0-2][0-9]:[0-6][0-9]:[0-6][0-9]/))
})

// tools.formattedUTCTime

// tools.safeFormattedTime

test('The upperFirstC funcion capitalizes the first letter of the given string.', () => {
  expect(tools.upperFirstC("apollo")).toBe("Apollo")
});

test('The numberWithCommas function converts a number larger than 1,000 to contain commas.', () => {
  let numbers = 999888777666555
  console.log(`tools.numberWithCommas(numbers) = ${tools.numberWithCommas(numbers)}`)
  expect(tools.numberWithCommas(numbers)).toBe("999,888,777,666,555")
})  // 999,888,777,666,555,444

//tools.getRandom(0, 10)

//tools.sendOwnerMessage("Haaiii", new Client())
