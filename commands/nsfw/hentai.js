const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Hentai extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Hentai',
      cooldown: 5,
      cost: 15,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await this.client.ksoft.images.random(this.client.utils.random(['hentai', 'hentai_gif']), { nsfw: ctx.channel.nsfw })

    const embed = new MessageEmbed()
      .setTitle('Hentai')
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter('Powered by KSoft.Si', ctx.author.displayAvatarURL({ size: 32, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = Hentai
