const AnimalCommand = require('#structures/AnimalCommand')

class Fox extends AnimalCommand {
  constructor(...args) {
    super({
      url: 'https://randomfox.ca/floof/',
      aliases: ['randomfox']
    }, ...args)
  }
}

module.exports = Fox
