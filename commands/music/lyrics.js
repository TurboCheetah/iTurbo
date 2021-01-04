const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

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
      const track = await this.client.ksoft.lyrics.search(song, { limit: 1 })
        .catch(ctx.reply('No results found with that query.'))

      const { name, artist, lyrics, url, artwork } = track[0]

      const embed = new MessageEmbed()
        .setTitle(`${artist.name} - ${name}`)
        .setDescription(lyrics.trim().substring(0, 1990))
        .setURL(url)
        .setThumbnail(artwork)
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
        .setColor(0x9590EE)
        .setFooter('Powered by KSoft.si')

      return ctx.reply({ embed })
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (player && args[0] === 'current') {
      return search(player.queue.current.title)
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
    search(args.join(' '))
  }
}

module.exports = Lyrics
