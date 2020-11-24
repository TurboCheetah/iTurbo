const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

class Lyrics extends Command {
  constructor (...args) {
    super(...args, {
      description: "Get a song's lyrics.",
      usage: 'lyrics <song name|current>',
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, args) {
    const search = async (song) => {
      console.log(`[LYRICS] Seaching for ${song}`)
      const hits = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(song)}`, {
        headers: { Authorization: `Bearer ${this.client.config.genius}` }
      })
        .then((res) => res.json())
        .then((body) => body.response.hits)

      if (!hits.length) return ctx.reply('No results found with that query.')

      const url = hits[0].result.url
      const image = hits[0].result.song_art_image_thumbnail_url
      const title = hits[0].result.full_title
      const lyrics = await fetch(url)
        .then((res) => res.text())
        .then((html) => cheerio.load(html))
        .then(($) => $('div.lyrics').first().text())

      const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(lyrics.trim().substring(0, 1990))
        .setURL(url)
        .setThumbnail(image)
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
        .setColor(0x9590EE)
        .setFooter('Powered by Genius')

      return ctx.reply({ embed })
    }

    const queue = this.client.distube.getQueue(ctx.message)

    if (queue && args[0] === 'current') {
      return search(queue.songs[0].name)
    }

    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64 }))
        .setDescription('What song would you like to find the lyrics for?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.')
        .setTimestamp()
        .setColor(0x9590EE)

      const filter = (msg) => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (response.toLowerCase()) {
        return search(response)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply('Operation cancelled.')
      }
    }
    search(args[0])
  }
}

module.exports = Lyrics
