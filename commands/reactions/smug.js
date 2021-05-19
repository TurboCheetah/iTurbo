const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Smug extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Someone feels a bit smug',
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await c('https://nekos.life/api/v2/img/smug').json()

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(url).setFooter('Powered by nekos.life')

    return ctx.reply({ embed })
  }
}

module.exports = Smug
