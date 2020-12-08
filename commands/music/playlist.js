const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { FieldsEmbed } = require('discord-paginationembed')
const ytdl = require('@distube/ytdl')
const youtube_dl = require('@distube/youtube-dl')
const ytpl = require('@distube/ytpl')
const ytsr = require('@distube/ytsr')
const Song = require('distube/src/Song')
const dPlaylist = require('distube/src/Playlist')
const SearchResult = require('distube/src/SearchResult')

class Playlist extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Create custom playlists.',
      aliases: [],
      usage: 'playlist <create|delete|append|remove|info|list:default> [playlist]',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, [action = 'list', ...args]) {
    if (!['list', 'create', 'delete', 'info', 'append', 'remove', 'play'].includes(action)) return ctx.reply(`Usage: \`${ctx.guild.prefix}${this.usage}\``)
    /*
    const playlist = {
      playlist1: [{
        name: 'yeet',
        'other data': 'yes'
      },
      {
        name: 'yeet',
        'other data': 'yes'
      }]
    } */

    return this[action](ctx, args)
  }

  async isURL (string) {
    try {
      new URL(string)
    } catch {
      return false
    }
    return true
  }

  async handlePlaylist (ctx, args) {
    let playlist

    if (!args) return null
    if (Array.isArray(args)) {
      const spotifySongs = args.map(async i => console.log(i.url))
      const list = []
      for (const song of spotifySongs) {
        list.push({
          name: song.name,
          url: song.url,
          thumbnail: song.thumbnail
        })
      }
      return list
    }
    if (args instanceof Song) return args
    if (args instanceof SearchResult) return new Song(await ytdl.getInfo(args.url), ctx.author, true)
    if (typeof args === 'object') return new Song(args, ctx.author)
    if (ytdl.validateURL(args)) return new Song(await ytdl.getInfo(args), ctx.author, true)
    if (this.isURL(args)) {
      if (args.indexOf('youtube.com' || 'youtu.be') > -1) {
        playlist = await ytpl(args, { limit: Infinity })
        playlist.items = playlist.items.filter(v => !v.thumbnail.includes('no_thumbnail')).map(v => new Song(v, ctx.author, true))
      } else if (args.indexOf('open.spotify.com' || 'play.spotify.com') > -1) {
        await this.auth()
        const url = args
        const id = this.getID(url)
        if (url.search('album') > 1) {
          return this.handleAlbum(ctx, id)
        }
        if (url.search('track') > 1) {
          return this.handleTrack(ctx, id)
        }
        if (url.search('playlist') > 1) {
          return this.handleSPlaylist(ctx, id)
        }
      }
      if (!this.client.distube.options.youtubeDL) throw new Error('Not Supported URL!')
      const info = await youtube_dl.getInfo(args).catch(e => { throw new Error(`[youtube-dl] ${e.stderr || e}`) })
      if (Array.isArray(info) && info.length > 0) {
        const soundcloudSongs = info.map(i => new Song(i, ctx.author))
        const list = []
        for (const song of soundcloudSongs) {
          list.push({
            name: song.name,
            url: song.url,
            thumbnail: song.thumbnail
          })
        }
        return list
      }
      return new Song(info, ctx.author)
    }
    if (!playlist) throw Error('Invalid Playlist')
    if (!(playlist instanceof dPlaylist)) playlist = new dPlaylist(playlist, ctx.author)
    if (!playlist.songs.length) throw Error('No valid video in the playlist')
    const songs = playlist.songs
    const list = []
    for (const song of songs) {
      list.push({
        name: song.name,
        url: song.url,
        thumbnail: song.thumbnail
      })
    }
    return list
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
    return this.handlePlaylist(ctx, results[0])
  }

  async handleAlbum (ctx, id) {
    const ids = []
    const songs = []
    const data = await this.client.spotifyApi.getAlbum(id).catch((err) => console.log(err))
    data.body.tracks.items.map((e) => ids.push(e.id))
    const artists = []
    for (const id of ids) {
      const data = await this.client.spotifyApi.getTrack(id).catch((err) => console.error(err))
      data.body.artists.map((artist) => artists.push(artist.name))
      const search = await ytsr(`${data.body.name} ${artists.join(', ')}`, { limit: 1 })
      const results = search.items.map(i => new SearchResult(i))
      if (results.length === 0) throw Error('No result!')
      songs.push(results[0])
    }
    return this.handlePlaylist(ctx, songs)
  }

  async handleSPlaylist (ctx, id) {
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
      songs.push(results[0])
    }
    return this.handlePlaylist(ctx, songs)
  }

  async list (ctx) {
    if (!ctx.author.settings.playlist || !ctx.author.settings.playlist.playlists) return ctx.reply("You don't have any playlists yet!")

    const embed = new MessageEmbed()
      .setTitle('Playlists')
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setColor(0x9590EE)
      .setDescription(Object.keys(ctx.author.settings.playlist.playlists).map((playlist) => `• ${playlist}`).join('\n'))

    return ctx.reply({ embed })
  }

  async create (ctx, args) {
    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}create <playlistName>`)
    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply('You must provide a name for the playlist.')

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if (playlistName.length > 35) return ctx.reply('Playlist name cannot be longer than 35 characters!')

    // Get existing playlsits to append to.
    const playlist = ctx.author.settings.playlist || {}
    if (!playlist.playlists) playlist.playlists = {}
    const playlists = playlist.playlists

    // Avoid duplicates.
    if (playlists[playlistName]) return ctx.reply('That playlist has already been created.')

    // Create new object with playlistName as the key
    playlists[playlistName] = {
      name: playlistName,
      author: ctx.author.tag,
      songs: []
    }

    // Push changes to databse
    await ctx.author.update({ playlist })
    return ctx.reply(`${this.client.constants.success} Successfully created playlist \`${playlistName}\`! Use \`${ctx.guild.settings.prefix}playlist append ${playlistName}; <songURL|queue>\` to add some songs`)
  }

  async delete (ctx, args) {
    if (!ctx.author.settings.playlist || !ctx.author.settings.playlist.playlists) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}delete <playlistName>`)

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply('You must provide the name for the playlist you\'d like to delete.')

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}
    if (!playlist.playlists) playlist.playlists = {}
    const playlists = playlist.playlists

    if (!playlists[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    // Delete playlistName object from playlists "array"
    delete (playlists[playlistName])

    await ctx.author.update({ playlist })

    return ctx.reply(`${this.client.constants.success} Successfully deleted the playlist \`${playlistName}\`.`)
  }

  async info (ctx, args) {
    if (!ctx.author.settings.playlist || !ctx.author.settings.playlist.playlists) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}info <playlistName>`)

    const playlistName = args.join(' ').split(';')[0]
    const page = args.join(' ').split(';')[1] || 1
    if (!playlistName) return ctx.reply('You must provide the name for the playlist you\'d like to play.')

    // Get existing playlists
    let playlist = ctx.author.settings.playlist || {}
    if (!playlist.playlists) playlist.playlists = {}
    const playlists = playlist.playlists

    if (!playlists[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist has doesn't exist!`)
    playlist = playlists[playlistName]

    // Send information embed
    const Pagination = new FieldsEmbed()
      .setArray(playlist.songs)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setElementsPerPage(5)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
      .formatField('Songs', song => `**${playlist.songs.indexOf(song) + 1}**. [${song.name}](${song.url})`)

    Pagination.embed
      .setColor(0x9590EE)
      .setAuthor(`by ${ctx.author.tag}`)
      .setTitle(playlist.name)
      .setThumbnail(playlist.songs[0].thumbnail)
      .setFooter(null, ctx.author.displayAvatarURL({ size: 64 }))

    return Pagination.build()
  }

  async append (ctx, args) {
    if (!ctx.author.settings.playlist || !ctx.author.settings.playlist.playlists) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}append <playlistName>; <songURL|queue>`)

    const playlistName = args.join(' ').split('; ')[0]
    if (!playlistName) return ctx.reply('You must provide the name for the playlist you\'d like to delete.')
    let songToAppend = args.join(' ').split('; ')[1]

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}
    if (!playlist.playlists) playlist.playlists = {}
    const playlists = playlist.playlists

    if (!playlists[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    const msg = await ctx.reply('Please wait, appending song(s) to playlist')
    // Append queue
    if (songToAppend && songToAppend === 'queue') {
      const queue = this.client.distube.getQueue(ctx.message)
      if (!queue || queue === undefined) {
        return ctx.reply('There is nothing in the queue!')
      }

      const list = []
      for (const song of queue) {
        list.push(song.url)
      }

      for (const song of list) {
        // Check if song is already in the playlsit
        if (playlists[playlistName].songs.indexOf(song) > -1) continue

        return playlists[playlistName].songs.push(song)
      }
    }
    if (!songToAppend || (!this.isURL(songToAppend) && songToAppend !== 'queue')) return ctx.reply(`Please specify a song URL to append to ${playlistName} (Cannot be a Spotify URL)`)
    let songToAppendMsg
    if (songToAppend.startsWith('https://www.youtube.com/playlist') || (songToAppend.includes('https://soundcloud.com/') && songToAppend.includes('/sets/')) || songToAppend.includes('open.spotify.com' || 'play.spotify.com')) {
      songToAppend = await this.handlePlaylist(ctx, songToAppend)
      songToAppendMsg = `${songToAppend.length} songs`

      // Append song to playlistName.songs array
      for (const song of songToAppend) {
        // Check if song is already in the playlsit
        if (playlists[playlistName].songs.indexOf(song) > -1) continue

        playlists[playlistName].songs.push(song)
      }
    } else {
      songToAppend = await this.handlePlaylist(ctx, songToAppend)
      songToAppendMsg = songToAppend.name

      // Check if song is already in the playlsit
      if (playlists[playlistName].songs.indexOf(songToAppend) > -1) return ctx.reply(`That song is already in \`${playlistName}\`!`)
      // Append song to playlistName.songs array
      playlists[playlistName].songs.push(songToAppend)
    }

    await ctx.author.update({ playlist })

    return msg.edit(`${this.client.constants.success} Successfully appended \`${songToAppendMsg}\` to \`${playlistName}\`.`)
  }

  async remove (ctx, args) {
    if (!ctx.author.settings.playlist || !ctx.author.settings.playlist.playlists) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}remove <playlistName> <songIndex>`)

    const playlistName = args.join(' ').split(' ')[0]
    if (!playlistName) return ctx.reply('You must provide the name for the playlist you\'d like to delete.')
    const songToRemove = Number(args.join(' ').split(' ')[1])

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}
    if (!playlist.playlists) playlist.playlists = {}
    const playlists = playlist.playlists

    if (!playlists[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    const msg = await ctx.reply('Please wait, removing song from playlist')

    if (!songToRemove) return ctx.reply(`Please specify a song number to remove from ${playlistName}! You can get it from \`${ctx.guild.settings.prefix}playlist info ${playlistName}\``)
    // Check if song is already in the playlsit
    if (!playlists[playlistName].songs[songToRemove - 1]) return ctx.reply(`That song is already in \`${playlistName}\`!`)

    const songToAppendMsg = playlists[playlistName].songs[songToRemove - 1].name

    // Append song to playlistName.songs array
    playlists[playlistName].songs.splice(songToRemove - 1, 1)

    await ctx.author.update({ playlist })

    return msg.edit(`${this.client.constants.success} Successfully removed \`${songToAppendMsg}\` from \`${playlistName}\`.`)
  }

  async play (ctx, args) {
    if (!ctx.author.settings.playlist || !ctx.author.settings.playlist.playlists) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}play <playlistName>`)

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply('You must provide the name for the playlist you\'d like to play.')

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}
    if (!playlist.playlists) playlist.playlists = {}
    const playlists = playlist.playlists

    if (!playlists[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    const msg = await ctx.reply('Queueing playlist...')

    // Add playlist to queue
    const songs = []
    for (const song of playlists[playlistName].songs) {
      songs.push(song.url)
    }
    await this.client.distube.playCustomPlaylist(ctx, songs, { name: playlists[playlistName].name })
    await msg.delete()
  }
}

module.exports = Playlist
