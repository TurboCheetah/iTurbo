const AnimalCommand = require('#structures/AnimalCommand')

class Duck extends AnimalCommand {
  constructor(...args) {
    super({
      url: 'https://random-d.uk/api/v1/random',
      aliases: ['randomduck', 'ducc']
    }, ...args)
  }
}

module.exports = Duck
