const AnimalCommand = require('#structures/AnimalCommand')

class Dog extends AnimalCommand {
  constructor(...args) {
    super({
      url: 'https://dog.ceo/api/breeds/image/random',
      aliases: ['randomdog', 'woof']
    }, ...args)
  }
}

module.exports = Dog
