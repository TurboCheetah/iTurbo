const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class HAss extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Hentai Ass',
      cooldown: 5,
      cost: 0,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await this.client.ksoft.images.random('ass', { nsfw: ctx.channel.nsfw })

    const embed = new MessageEmbed()
      .setTitle('Hentai Ass')
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by KSoft.si`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = HAss