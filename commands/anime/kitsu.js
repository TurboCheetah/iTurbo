const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Kitsu extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/anime/kitsu:description'),
      usage: language => language('commands/anime/kitsu:usage'),
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
        .setDescription(ctx.translate('commands/anime/kitsu:prompt'))
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.tr('common:noReplyTimeout', { time: 60 })

      if (response.toLowerCase()) {
        const page = this.verifyInt(1, 1)

        const { data } = await c(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(response)}`).json()

        if (!data || !data.length) return ctx.tr('common:noResults')

        const res = data[page - 1]
        if (!res) return ctx.tr('commands/anime/kitsu:invalidPage', { page: page, length: data.length })

        const embed = new MessageEmbed()
          .setColor(0x9590ee)
          .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (${ctx.translate('commands/anime/kitsu:japanese', { title: res.attributes.titles.en_jp })})` : res.attributes.titles.en_jp)
          .setDescription(res.attributes.synopsis)
          .addField(ctx.translate('commands/anime/kitsu:ageRating'), `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ''}`)
          .addField(ctx.translate('commands/anime/kitsu:episodes'), ctx.translate('commands/anime/kitsu:episodeData', { count: res.attributes.episodeCount, length: res.attributes.episodeLength }))
          .setImage(res.attributes.coverImage && res.attributes.coverImage.original)
          .setThumbnail(res.attributes.posterImage && res.attributes.posterImage.original)
          .setURL(`https://kitsu.io/anime/${res.id}`)
          .setFooter(ctx.translate('common:page', { page: page, pages: data.length }))
          .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))

        return ctx.reply({ embed })
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.tr('common:operationCancelled')
      }
    }
    let [title, page = 1] = args.join(' ').split(' | ')
    page = this.verifyInt(page, 1)

    const { data } = await c(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}`).json()

    if (!data || !data.length) return ctx.tr('common:noResults')

    const res = data[page - 1]
    if (!res) return ctx.tr('commands/anime/kitsu:invalidPage', { page: page, length: data.length })

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (${ctx.translate('commands/anime/kitsu:japanese', { title: res.attributes.titles.en_jp })})` : res.attributes.titles.en_jp)
      .setDescription(res.attributes.synopsis)
      .addField(ctx.translate('commands/anime/kitsu:ageRating'), `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ''}`)
      .addField(ctx.translate('commands/anime/kitsu:episodes'), ctx.translate('commands/anime/kitsu:episodeData', { count: res.attributes.episodeCount, length: res.attributes.episodeLength }))
      .setImage(res.attributes.coverImage && res.attributes.coverImage.original)
      .setThumbnail(res.attributes.posterImage && res.attributes.posterImage.original)
      .setURL(`https://kitsu.io/anime/${res.id}`)
      .setFooter(ctx.translate('page', { page: page, pages: data.length }))
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = Kitsu
