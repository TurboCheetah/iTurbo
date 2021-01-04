const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class hFeet extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Hentai Feet',
      cooldown: 5,
      cost: 15,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await fetch('https://nekos.life/api/v2/img/feet').then(res => res.json())

    const embed = new MessageEmbed()
      .setTitle('Hentai Feet')
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = hFeet
