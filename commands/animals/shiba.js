const AnimalCommand = require('#structures/AnimalCommand')

class Shiba extends AnimalCommand {
  constructor(...args) {
    super({
      url: 'https://shibe.online/api/shibes',
      aliases: ['doge', 'shib', 'shiba', 'shibainu', 'shibe']
    }, ...args)
  }
}

module.exports = Shiba
