const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Wikihow extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/wikihow:description'),
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url, article } = await this.client.ksoft.images.wikihow()
    const embed = new MessageEmbed().setColor(this.client.constants.color).setTitle(article.title).setURL(article.link).setImage(url).setFooter(ctx.translate('common:poweredByKSoft'))
    ctx.reply({ embed })
  }
}

module.exports = Wikihow
