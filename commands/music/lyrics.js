const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Lyrics extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a song's lyrics.",
      usage: 'lyrics <song | lyrics>',
      arguments: {
        song: 'Name of the song to find the lyrics of',
        lyrics: 'Whether or not to reverse search the lyrics of a song'
      },
      examples: {
        'lil peep - witchblades': 'Returns the lyrics for "Lil Peep - Witch Blades"',
        'lyrics when I die bury me without the lights on': 'Returns the lyrics for "Lil Peep - Witch Blades"'
      },
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    const search = async (song, textOnly = false) => {
      this.client.ksoft.lyrics
        .search(song, { limit: 1, textOnly: textOnly })
        .then(track => {
          const { name, artist, lyrics, url, artwork } = track[0]

          const embed = new MessageEmbed()
            .setTitle(`${artist.name} - ${name}`)
            .setDescription(lyrics.trim().substring(0, 1990))
            .setURL(url)
            .setThumbnail(artwork)
            .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
            .setColor(0x9590ee)
            .setFooter('Powered by KSoft.Si')

          return ctx.reply({ embed })
        })
        .catch(() => {
          return ctx.reply('No results found with that query.')
        })
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (player && !args.length) {
      return search(player.queue.current.title)
    }

    if (!player && !args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription('What song would you like to find the lyrics for?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.')
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (response.toLowerCase()) {
        return search(response)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply('Operation cancelled.')
      }
    }

    if (args[0] === 'lyrics') {
      args.splice(0, 1)

      if (!args[0]) {
        const embed = new MessageEmbed()
          .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
          .setDescription("What are the lyrics you'd like to search?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.")
          .setTimestamp()
          .setColor(0x9590ee)

        const filter = msg => msg.author.id === ctx.author.id
        const response = await ctx.message.awaitReply('', filter, 60000, embed)
        if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

        if (response.toLowerCase()) {
          return search(response, true)
        } else if (response.toLowerCase() === 'cancel') {
          return ctx.reply('Operation cancelled.')
        }
      }
      return search(args.join(' '), true)
    }

    search(args.join(' '))
  }
}

module.exports = Lyrics
