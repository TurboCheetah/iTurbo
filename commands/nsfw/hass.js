const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class HAss extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Hentai Ass',
      cooldown: 3,
      cost: 3,
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
      .setFooter(`Powered by `, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = HAss
