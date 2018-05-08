const ioTools = new (require('../util/IOTools'))()
const path = require('path')

test('The getImagePath(path) function returns a path to the correct directory.', () => {
  expect(ioTools.getImagePath(path.join('alcha', 'Jerry-1.gif'))).toEqual(path.join('images', 'alcha', 'Jerry-1.gif'))
  expect(ioTools.getImagePath('null')).toBe('Invalid file path provided.')
  expect(ioTools.getImagePath('undefined')).toHaveLength(27)
})
