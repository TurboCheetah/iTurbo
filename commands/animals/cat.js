const AnimalCommand = require('#structures/AnimalCommand')

class Cat extends AnimalCommand {
  constructor(...args) {
    super({
      url: 'https://aws.random.cat/meow',
      aliases: ['meow', 'catpic', 'randomcat']
    }, ...args)
  }
}

module.exports = Cat
