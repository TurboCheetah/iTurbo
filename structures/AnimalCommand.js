const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class AnimalCommand extends Command {
  constructor({ url, ...options }, ...args) {
    super(...args, {
      description: language => language.get(`${options.name}Description`),
      cooldown: 3,
      botPermissions: ['EMBED_LINKS'],
      ...options
    })
    this.url = url
  }

  async run(ctx) {
    const image = await c(this.url).json()

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setImage(image.url || Object.values(image)[0])

    return ctx.reply({ embed })
  }
}

module.exports = AnimalCommand
