const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class hCum extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Hentai Cum',
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ['hcreampie'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx) {
    const { url } = await fetch('https://nekos.life/api/v2/img/cum')
      .then((res) => res.json())

    const embed = new MessageEmbed()
      .setTitle('Hentai Cum')
      .setColor(0x9590EE)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = hCum
