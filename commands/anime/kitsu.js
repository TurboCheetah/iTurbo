const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Kitsu extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('kitsuDescription'),
      usage: language => language.get('kitsuUsage'),
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
        .setDescription(ctx.language.get('kitsuPrompt'))
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply(ctx.language.get('noReplyTimeout', 60))

      if (response.toLowerCase()) {
        const page = this.verifyInt(1, 1)

        const { data } = await c(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(response)}`).json()

        if (!data || !data.length) return ctx.reply(ctx.language.get('noResults'))

        const res = data[page - 1]
        if (!res) return ctx.reply(ctx.language.get('kitsuInvalidPage', page, data.length))

        const embed = new MessageEmbed()
          .setColor(0x9590ee)
          .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (${ctx.language.get('kitsuJapanese', res.attributes.titles.en_jp)})` : res.attributes.titles.en_jp)
          .setDescription(res.attributes.synopsis)
          .addField(ctx.language.get('kitsuAgeRating'), `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ''}`)
          .addField(ctx.language.get('kitsuEpisodes'), ctx.language.get('kitsuEpisodeData', res.attributes.episodeCount, res.attributes.episodeLength))
          .setImage(res.attributes.coverImage && res.attributes.coverImage.original)
          .setThumbnail(res.attributes.posterImage && res.attributes.posterImage.original)
          .setURL(`https://kitsu.io/anime/${res.id}`)
          .setFooter(ctx.language.get('page', page, data.length))
          .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))

        return ctx.reply({ embed })
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply(ctx.language.get('operationCancelled'))
      }
    }
    let [title, page = 1] = args.join(' ').split(' | ')
    page = this.verifyInt(page, 1)

    const { data } = await c(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}`).json()

    if (!data || !data.length) return ctx.reply(ctx.language.get('noResults'))

    const res = data[page - 1]
    if (!res) return ctx.reply(ctx.language.get('kitsuInvalidPage', page, data.length))

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (${ctx.language.get('kitsuJapanese', res.attributes.titles.en_jp)})` : res.attributes.titles.en_jp)
      .setDescription(res.attributes.synopsis)
      .addField(ctx.language.get('kitsuAgeRating'), `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ''}`)
      .addField(ctx.language.get('kitsuEpisodes'), ctx.language.get('kitsuEpisodeData', res.attributes.episodeCount, res.attributes.episodeLength))
      .setImage(res.attributes.coverImage && res.attributes.coverImage.original)
      .setThumbnail(res.attributes.posterImage && res.attributes.posterImage.original)
      .setURL(`https://kitsu.io/anime/${res.id}`)
      .setFooter(ctx.language.get('page', page, data.length))
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = Kitsu
