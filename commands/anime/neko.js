const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class Neko extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get a random Neko.',
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await fetch('https://nekos.life/api/v2/img/neko').then(res => res.json())

    const embed = new MessageEmbed()
      .setTitle('Neko')
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = Neko
