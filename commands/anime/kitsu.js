const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class Kitsu extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Search an Anime on Kitsu.io',
      usage: 'kitsu <title>, [page]',
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64 }))
        .setDescription('What anime would you like to search for?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.')
        .setTimestamp()
        .setColor(0x9590EE)

      const filter = (msg) => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (response.toLowerCase()) {
        const page = this.verifyInt(1, 1)

        const { data } = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(response)}`)
          .then((r) => r.json())

        if (!data || !data.length) return ctx.reply('No results found.')

        const res = data[page - 1]
        if (!res) return ctx.reply(`Invalid page ${page} there is only ${data.length} pages.`)

        const embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (Japanese: ${res.attributes.titles.en_jp})` : res.attributes.titles.en_jp)
          .setDescription(res.attributes.synopsis)
          .addField('Age Rating', `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ''}`)
          .addField('Episodes', `${res.attributes.episodeCount} (${res.attributes.episodeLength} Min Per Episode)`)
          .setImage(res.attributes.coverImage && res.attributes.coverImage.original)
          .setThumbnail(res.attributes.posterImage && res.attributes.posterImage.original)
          .setURL(`https://kitsu.io/anime/${res.id}`)
          .setFooter(`Page ${page}/${data.length}`)
          .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))

        return ctx.reply({ embed })
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply('Operation cancelled.')
      }
    }
    let [title, page = 1] = args.join(' ').split(', ')
    page = this.verifyInt(page, 1)

    const { data } = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}`)
      .then((r) => r.json())

    if (!data || !data.length) return ctx.reply('No results found.')

    const res = data[page - 1]
    if (!res) return ctx.reply(`Invalid page ${page} there is only ${data.length} pages.`)

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (Japanese: ${res.attributes.titles.en_jp})` : res.attributes.titles.en_jp)
      .setDescription(res.attributes.synopsis)
      .addField('Age Rating', `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ''}`)
      .addField('Episodes', `${res.attributes.episodeCount} (${res.attributes.episodeLength} Min Per Episode)`)
      .setImage(res.attributes.coverImage && res.attributes.coverImage.original)
      .setThumbnail(res.attributes.posterImage && res.attributes.posterImage.original)
      .setURL(`https://kitsu.io/anime/${res.id}`)
      .setFooter(`Page ${page}/${data.length}`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))

    return ctx.reply({ embed })
  }
}

module.exports = Kitsu
