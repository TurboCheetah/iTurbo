const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class hBJ extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Hentai Blowjob',
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ['hblowjob'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await fetch('https://nekos.life/api/v2/img/bj').then(res => res.json())

    const embed = new MessageEmbed()
      .setTitle('Hentai Blowjob')
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = hBJ
