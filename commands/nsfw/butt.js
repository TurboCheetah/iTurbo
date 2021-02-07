const Command = require('../../structures/Command.js')
const c = require('@aero/centra')
const { MessageEmbed } = require('discord.js')

class Butt extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Returns a picture of a butt.',
      usage: 'ass',
      aliases: ['ass', 'booty'],
      cooldown: 3,
      cost: 3,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })

    this.errorMessage = 'There was an error.'
  }

  async run(ctx) {
    try {
      const [data] = await c('https://api.obutts.ru/butts/0/1/random').json()

      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setImage(`http://media.obutts.ru/${data.preview}`)
        .setFooter('Powered by oButts.ru', ctx.author.displayAvatarURL({ size: 32, dynamic: true }))
      return ctx.reply({ embed })
    } catch (err) {
      throw this.errorMessage
    }
  }
}

module.exports = Butt
