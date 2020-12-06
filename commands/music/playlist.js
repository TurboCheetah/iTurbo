const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const ytdl = require('@distube/ytdl')
const youtube_dl = require('@distube/youtube-dl')
const ytpl = require('@distube/ytpl')
const Song = require('distube/src/Song')
const dPlaylist = require('distube/src/Playlist')
const SearchResult = require('distube/src/SearchResult')

class Playlist extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Create custom playlists.',
      aliases: [],
      usage: 'playlist <add|remove|list:default> <playlist>',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, [action = 'list', ...args]) {
    if (!['list', 'create', 'delete', 'append', 'remove'].includes(action)) return ctx.reply(`Usage: \`${ctx.guild.prefix}${this.usage}\``)
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

  async handlePlaylist (ctx, args) {
    const isURL = string => {
      try {
        new URL(string)
      } catch {
        return false
      }
      return true
    }

    let playlist

    if (!args) return null
    if (args instanceof Song) return args
    if (args instanceof SearchResult) return new Song(await ytdl.getInfo(args.url), ctx.author, true)
    if (typeof args === 'object') return new Song(args, ctx.author)
    if (ytdl.validateURL(args)) return new Song(await ytdl.getInfo(args), ctx.author, true)
    if (isURL(args)) {
      if (args.indexOf('youtube.com' || 'youtu.be') > -1) {
        playlist = await ytpl(args, { limit: Infinity })
        playlist.items = playlist.items.filter(v => !v.thumbnail.includes('no_thumbnail')).map(v => new Song(v, ctx.author, true))
      }
      if (!this.client.distube.options.youtubeDL) throw new Error('Not Supported URL!')
      const info = await youtube_dl.getInfo(args).catch(e => { throw new Error(`[youtube-dl] ${e.stderr || e}`) })
      if (Array.isArray(info) && info.length > 0) return info.map(i => new Song(i, ctx.author))
      return new Song(info, ctx.author)
    }
    if (!playlist) throw Error('Invalid Playlist')
    if (!(playlist instanceof dPlaylist)) playlist = new dPlaylist(playlist, ctx.author)
    if (!playlist.songs.length) throw Error('No valid video in the playlist')
    const songs = playlist.songs
    const list = []
    for (const song of songs) {
      list.push(song.url)
    }
    return list
  }

  async list (ctx) {
    if (!ctx.author.settings.playlist || !ctx.author.settings.playlist.length || !ctx.author.settings.playlist.playlists || !ctx.author.settings.playlist.playlists.length) return ctx.reply("You don't have any playlists yet!")

    const embed = new MessageEmbed()
      .setTitle('Playlists')
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setColor(0x9590EE)
      .setDescription(ctx.author.settings.playlist.playlists.map((playlist) => `• ${playlist.name}`).join('\n'))

    return ctx.reply({ embed })
  }

  async create (ctx, args) {
    if (ctx.author.settings.playlist && ctx.author.settings.playlist.length >= 10) return ctx.reply("You can't have more than 10 playlists. Remove some before trying again.")

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
    return ctx.reply(`${this.client.constants.success} Successfully created playlsit \`${playlistName}\`! Use \`${ctx.guild.settings.prefix}playlist append ${playlistName} <songURL>\` or \`${ctx.guild.settings.prefix}playlist appendQueue ${playlistName}\` to add some songs`)
  }

  async delete (ctx, args) {
    if (!ctx.author.settings.playlist.playlists || !ctx.author.settings.playlist.playlists.length) return ctx.reply("You don't have any playlists yet!")

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply('You must provide the name for the playlist you\'d like to delete.')

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}
    if (!playlist.playlists) playlist.playlists = {}
    const playlists = playlist.playlists

    if (!playlists[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist has doesn't exist!`)

    // Delete playlistName object from playlists "array"
    delete (playlists[playlistName])

    await ctx.author.update({ playlist })

    return ctx.reply(`${this.client.constants.success} Successfully deleted the playlist \`${playlistName}\`.`)
  }
}

module.exports = Playlist
