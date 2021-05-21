const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Bird extends KSoftImageCommand {
  constructor(...args) {
    super({ command: 'birb' }, ...args)
  }
}

module.exports = Bird
