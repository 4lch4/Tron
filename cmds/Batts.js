const Tools = require('../util/Tools')
const tools = new Tools()

class Batts {
  constructor (options) {
    this.options = options || {}
  }

  getRandomEquation () {
    return new Promise((resolve, reject) => {
      switch (tools.getRandom(0, 6)) {
        case 0:
          resolve(this.getOneStepEquation())
          break

        case 1:
          resolve(this.getTwoStepEquation())
          break

        case 2:
          resolve(this.getLikeTermsEquation())
          break

        case 3:
          resolve(this.getXOnBothSidesEquation())
          break

        case 4:
          resolve(this.getDistPropertyEquation())
          break

        case 5:
          resolve(this.getQuadraticEquation())
          break

        default:
          break
      }
    })
  }

  getOperation () {
    switch (tools.getRandom(0, 4)) {
      case 0:
        return '+'

      case 1:
        return '-'

      case 2:
        return '*'

      case 3:
        return '/'

      default:
    }
  }

  getOneStepEquation () {
    return new Promise((resolve, reject) => {
      let randomA = tools.getRandom(0, 100)
      let randomB = tools.getRandom(0, 100)

      resolve('x ' + this.getOperation() + ' ' + randomA + ' = ' + randomB)
    })
  }

  getTwoStepEquation () {
    return new Promise((resolve, reject) => {
      let randomA = tools.getRandom(0, 100)
      let randomB = tools.getRandom(0, 100)
      let randomC = tools.getRandom(0, 100)

      resolve(randomA + 'x ' + this.getOperation() + ' ' + randomB + ' = ' + randomC)
    })
  }

  getLikeTermsEquation () {
    return new Promise((resolve, reject) => {
      let randomA = tools.getRandom(0, 100)
      let randomB = tools.getRandom(0, 100)
      let randomC = tools.getRandom(0, 100)
      let randomD = tools.getRandom(0, 100)

      resolve(randomA + 'x ' + this.getOperation() + ' ' + randomB + ' ' + this.getOperation() + ' ' + randomC + 'x = ' + randomD)
    })
  }

  getXOnBothSidesEquation () {
    return new Promise((resolve, reject) => {
      let randomA = tools.getRandom(0, 100)
      let randomB = tools.getRandom(0, 100)
      let randomC = tools.getRandom(0, 100)
      let randomD = tools.getRandom(0, 100)

      resolve(randomA + ' ' + this.getOperation() + ' ' + randomB + 'x = ' + randomC + ' ' + this.getOperation() + ' ' + randomD + 'x')
    })
  }

  getDistPropertyEquation () {
    return new Promise((resolve, reject) => {
      let randomA = tools.getRandom(0, 100)
      let randomB = tools.getRandom(0, 100)
      let randomC = tools.getRandom(0, 100)

      resolve(randomA + '(' + randomB + ' ' + this.getOperation() + ' ' + 'x) = ' + randomC)
    })
  }

  getQuadraticEquation () {
    return new Promise((resolve, reject) => {
      let randomA = tools.getRandom(0, 100)
      let randomB = tools.getRandom(0, 100)
      let randomC = tools.getRandom(0, 100)
      let randomD = tools.getRandom(0, 100)

      resolve(randomA + 'x² ' + this.getOperation() + ' ' + randomB + 'x ' + this.getOperation() + ' ' + randomC + ' = ' + randomD)
    })
  }
}

module.exports = Batts
