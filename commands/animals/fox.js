const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Fox extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['randomfox'],
      description: 'Grabs a random fox image from randomfox.ca',
      extendedHelp: 'This command grabs a random fox from https://randomfox.ca/floof/',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { image } = await c('https://randomfox.ca/floof/').json()

    return ctx.reply(new MessageEmbed().setTitle('Random Fox').setColor(0x9590ee).setImage(image))
  }
}

module.exports = Fox
