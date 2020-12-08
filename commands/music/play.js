const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
// const { getPreview, getTracks } = require('spotify-url-info')
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

  async auth () {
    const TOKEN = await this.client.spotifyApi.clientCredentialsGrant()
    return this.client.spotifyApi.setAccessToken(TOKEN.body.access_token)
  }

  getID (url) {
    const URL = url.substring(url.search(/(album).|(track).|(playlist)./g), url.length)
    return URL.substring(URL.search('/') + 1, URL.length)
  }

  async handleTrack (ctx, id) {
    const artists = []
    const data = await this.client.spotifyApi.getTrack(id).catch((err) => console.error(err))
    data.body.artists.map((artist) => artists.push(artist.name))
    const search = await ytsr(`${data.body.name} ${artists.join(', ')}`, { limit: 1 })
    const results = search.items.map(i => new SearchResult(i))
    if (results.length === 0) throw Error('No result!')
    return this.client.distube.play(ctx.message, results[0].url)
  }

  async handleAlbum (ctx, id) {
    const m = await ctx.reply('Please wait, adding songs to queue...')
    const ids = []
    const songs = []
    const data = await this.client.spotifyApi.getAlbum(id).catch((err) => console.log(err))
    data.body.tracks.items.map((e) => ids.push(e.id))
    for (const id of ids) {
      const artists = []
      const data = await this.client.spotifyApi.getTrack(id).catch((err) => console.error(err))
      data.body.artists.map((artist) => artists.push(artist.name))
      const search = await ytsr(`${data.body.name} ${artists.join(', ')}`, { limit: 1 })
      const results = search.items.map(i => new SearchResult(i))
      if (results.length === 0) throw Error('No result!')
      songs.push(results[0].url)
    }

    m.edit(`Added ${data.body.tracks.total} from ${data.body.name} - ${data.body.label} album`).then(ctx => {
      ctx.delete({ timeout: 2500 })
    })
    return this.client.distube.playCustomPlaylist(ctx.message, songs, { name: data.body.label })
  }

  async handlePlaylist (ctx, id) {
    const m = await ctx.reply('Please wait, adding songs to queue...')
    const ids = []
    const songs = []
    const data = await this.client.spotifyApi.getPlaylist(id, { pageSize: 200, limit: 200 }).catch((err) => console.log(err))
    data.body.tracks.items.map((e) => ids.push(e.track.id))
    for (const id of ids) {
      const artists = []
      const data = await this.client.spotifyApi.getTrack(id).catch((err) => console.error(err))
      data.body.artists.map((artist) => artists.push(artist.name))
      const search = await ytsr(`${data.body.name} ${artists.join(', ')}`, { limit: 1 })
      const results = search.items.map(i => new SearchResult(i))
      if (results.length === 0) throw Error('No result!')
      songs.push(results[0].url)
    }

    m.edit(`Added ${data.body.tracks.total} from **${data.body.name}** playlist by **${data.body.owner.display_name}**`)

    this.client.distube.playCustomPlaylist(ctx.message, songs, { name: data.body.name })
    return m.delete()
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

    if (args[0].indexOf('open.spotify.com' || 'play.spotify.com') > -1) {
      /*       if (args[0].indexOf('/playlist/') > -1) {
        const m = await ctx.reply('Please wait, adding songs to queue...')
        const data = await getTracks(args[0])
        const songs = []
        for (const song of data) {
          if (!song || song === null || !song.artists || song.artists === null) {
            break
          }

          const search = await ytsr(`${song.artists[0].name} - ${song.name}`, { limit: 1 })
          const results = search.items.map(i => new SearchResult(i))
          if (results.length === 0) throw Error('No result!')
          songs.push(results[0].url)
        }

        m.delete()
        return this.client.distube.playCustomPlaylist(ctx.message, songs)
      }
      const data = await getPreview(args[0])
      const search = await ytsr(`${data.artist} - ${data.title}`, { limit: 1 })
      const results = search.items.map(i => new SearchResult(i))
      if (results.length === 0) throw Error('No result!')
      return this.client.distube.play(ctx.message, results[0].url) */
      await this.auth()
      const url = args[0]
      const id = this.getID(url)
      if (url.search('album') > 1) {
        this.handleAlbum(ctx, id); return
      }
      if (url.search('track') > 1) {
        this.handleTrack(ctx, id); return
      }
      if (url.search('playlist') > 1) {
        this.handlePlaylist(ctx, id); return
      }
      ctx.reply('Invalid link').then(ctx => {
        ctx.delete({ timeout: 2500 })
      })
    }

    this.client.distube.play(ctx.message, args.join(' '))
  }
}

module.exports = Play
