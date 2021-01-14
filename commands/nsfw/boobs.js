const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Boobs extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Returns a picture of boobs.',
      usage: 'boobs',
      aliases: ['tits', 'tiddies', 'titties', 'boobies'],
      cooldown: 3,
      cost: 3,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })

    this.errorMessage = 'There was an error.'
  }

  async run(ctx) {
    try {
      const [data] = await c('http://api.oboobs.ru/boobs/0/1/random').json()

      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setImage(`http://media.oboobs.ru/${data.preview}`)
        .setFooter(`Powered by oBoobs.ru`, ctx.author.displayAvatarURL({ size: 32 }))
      return ctx.reply({ embed })
    } catch (err) {
      throw this.errorMessage
    }
  }
}

module.exports = Boobs
