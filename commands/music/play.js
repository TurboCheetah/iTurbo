const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { getPreview, getTracks } = require('spotify-url-info')
const ytsr = require('@distube/ytsr')
const SearchResult = require('distube/src/SearchResult')

class Play extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Plays the desired song',
      aliases: ['pl'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'play <search query or URL>',
      guildOnly: true,
      cost: 0
    })
  }

  async run (ctx, args) {
    if (!args.length && this.client.distube.isPaused(ctx.message)) {
      this.client.distube.resume(ctx.message)
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')

    if (args[0].indexOf('open.spotify.com') > -1 || args[0].indexOf('play.spotify.com') > -1) {
      if (args[0].indexOf('/playlist/') > -1) {
        const data = await getTracks(args[0])
        let songs = []
        for (const song of data) {
          if (!song) {
            return
          }
          
          const search = await ytsr(`${song.artists[0].name} - ${song.name}`, { limit: 1 })
          const results = search.items.map(i => new SearchResult(i))
          if (results.length === 0) throw Error('No result!')
          songs.push(results[0].url)
        }

        console.log(songs);
        return this.client.distube.playCustomPlaylist(ctx.message, songs)
      }
      const data = await getPreview(args[0])
      const search = await ytsr(`${data.artist} - ${data.title}`, { limit: 1 })
      const results = search.items.map(i => new SearchResult(i))
      if (results.length === 0) throw Error('No result!')
      return this.client.distube.play(ctx.message, results[0].url)
    }

    this.client.distube.play(ctx.message, args.join(' '))
  }
}

module.exports = Play
