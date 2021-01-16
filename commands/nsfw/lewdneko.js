const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class LewdNeko extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Lewd Neko Hentai',
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ['lneko'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await this.client.ksoft.images.random('neko', { nsfw: ctx.channel.nsfw })

    const embed = new MessageEmbed()
      .setTitle('Lewd Neko')
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter('Powered by KSoft.Si', ctx.author.displayAvatarURL({ size: 32, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = LewdNeko
