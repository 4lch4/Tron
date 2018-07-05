const ioTools = new (require('../util/IOTools'))()
const path = require('path')

describe('The getImagePath(path) method works as expected.', () => {
  it('should return a path to the correct directory and file.', () => {
    expect(ioTools.getImagePath(path.join('alcha', 'Jerry-1.gif'))).toEqual(path.join('images', 'alcha', 'Jerry-1.gif'))
    expect(ioTools.getImagePath('null')).toBe('Invalid file path provided.')
    expect(ioTools.getImagePath('undefined')).toHaveLength(27)
  })

  it('should return a message if the file is too large.', () => {
    expect(ioTools.getImagePath(path.join('test', 'LargeFile.png'))).toEqual('Provided file is too large to send over Discord.')
  })

  it('should return an error message if an invalid file path is provided.', () => {
    expect(ioTools.getImagePath(path.join('test', 'asdfk.xml'))).toEqual('Invalid file path provided.')
  })
})

describe('The saveToFile(data, filename) method works as expected.', () => {
  it('should return the path and name of the saved file.', () => {
    return ioTools.saveToFile('TestData', 'test.log').then(res => {
      expect(res).toBe(path.join('data', 'filesSaved', 'test.log'))
    })
  })

  it('Should do return an error when the filename is anything other than a String.', async () => {
    try {
      const r = await ioTools.saveToFile('FileData', null)
    } catch (err) {
      expect(err.message).toBe("Path must be a string. Received null")
    }
  })

  it('Should throw an error when null is passed as the file data.', async () => {
    try {
      const r = await ioTools.saveToFile(null, null)
    } catch (err) {
      expect(err.message).toBe("Test")
    }
  })
})
