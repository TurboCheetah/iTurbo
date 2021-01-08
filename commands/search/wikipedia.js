const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Wikipedia extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['wiki'],
      description: 'Finds a Wikipedia Article by title.',
      usage: 'wikipedia <query>',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    const article = await c(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args.join(' '))}`)
      .json()
      .catch(() => {
        throw "I couldn't find a wikipedia article with that title!"
      })

    if (!article.content_urls) throw "I couldn't find a wikipedia article with that title!"
    const embed = new MessageEmbed().setColor(0x9590ee).setThumbnail('https://i.imgur.com/fnhlGh5.png').setURL(article.content_urls.desktop.page).setTitle(article.title).setDescription(article.extract)
    return ctx.reply({ embed })
  }
}

module.exports = Wikipedia
