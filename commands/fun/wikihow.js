const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Wikihow extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Gets a random wikihow image',
      usage: 'wikihow',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url, article } = await this.client.ksoft.images.wikihow()
    const embed = new MessageEmbed().setColor(0x9590ee).setTitle(article.title).setURL(article.link).setImage(url).setFooter('Powered by KSoft.si')
    ctx.reply({ embed })
  }
}

module.exports = Wikihow
