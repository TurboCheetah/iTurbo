/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { FieldsEmbed } = require('discord-paginationembed')
const { TrackUtils } = require('erela.js')
const c = require('@aero/centra')

class Playlist extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Manage custom playlists.',
      aliases: [],
      usage: 'playlist <create|delete|append|remove|info|play|shuffle|share|import|list:default> [playlist]',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [action = 'list', ...args]) {
    if (!['list', 'create', 'delete', 'info', 'append', 'remove', 'play', 'shuffle', 'share', 'import'].includes(action)) return ctx.msgEmbed(`Usage: \`${ctx.guild.prefix}${this.usage}\``, this.client.constants.errorImg)

    return this[action](ctx, args)
  }

  async isURL(string) {
    try {
      // eslint-disable-next-line no-new
      new URL(string)
    } catch {
      return false
    }
    return true
  }

  async handlePlaylist(ctx, args, spotify = false) {
    if (!args) return null
    if ((await this.isURL(args)) === true) {
      let res

      try {
        // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
        res = await this.client.manager.search(args, ctx.author)
        // Check the load type as this command is not that advanced for basics
        if (res.loadType === 'LOAD_FAILED') throw res.exception
        switch (res.loadType) {
          case 'TRACK_LOADED':
            await this.client.utils.sleep(1000)
            return await res.tracks[0]
          case 'PLAYLIST_LOADED':
            if (spotify) await this.client.utils.sleep(res.tracks.length * 650)
            return res.tracks
        }
      } catch (err) {
        return ctx.msgEmbed(`An error occurred while searching: ${err.message}`, this.client.constants.errorImg)
      }
      return res
    }
    return args
  }

  async list(ctx) {
    if (!ctx.author.settings.playlist) return ctx.msgEmbed("You don't have any playlists yet!", this.client.constants.errorImg)

    const Pagination = new FieldsEmbed()
      .setArray(Object.keys(ctx.author.settings.playlist))
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setElementsPerPage(5)
      .setPage(1)
      .setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
      .formatField('Playlists', playlist => playlist)

    Pagination.embed
      .setColor(0x9590ee)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setFooter('React to view info on that playlist', ctx.author.displayAvatarURL({ size: 64 }))

    return Pagination.build()
  }

  async create(ctx, args) {
    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}create <playlistName>`, this.client.constants.errorImg)
    const playlistName = args.join(' ')
    if (!playlistName) return ctx.msgEmbed('You must provide a name for the playlist.', this.client.constants.errorImg)

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if (playlistName.length > 35) return ctx.msgEmbed('Playlist name cannot be longer than 35 characters!', this.client.constants.errorImg)

    // Get existing playlsits to append to.
    const playlist = ctx.author.settings.playlist || {}

    // Avoid duplicates.
    if (playlist[playlistName]) return ctx.msgEmbed('That playlist has already been created.', this.client.constants.errorImg)

    // Create new object with playlistName as the key
    playlist[playlistName] = {
      name: playlistName,
      author: ctx.author,
      public: false,
      songs: []
    }

    // Push changes to databse
    await ctx.author.update({ playlist })
    return ctx.msgEmbed(`Successfully created playlist \`${playlistName}\`! Use \`${ctx.guild.settings.prefix}playlist append ${playlistName}; <songURL|queue>\` to add some songs`, this.client.constants.successImg)
  }

  async delete(ctx, args) {
    if (!ctx.author.settings.playlist) return ctx.msgEmbed("You don't have any playlists yet!", this.client.constants.errorImg)

    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}delete <playlistName>`, this.client.constants.errorImg)

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.msgEmbed("You must provide the name for the playlist you'd like to delete.", this.client.constants.errorImg)

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.msgEmbed("That playlist doesn't exist!", this.client.constants.errorImg)

    // Delete playlistName object from playlists "array"
    delete playlist[playlistName]

    await ctx.author.update({ playlist })

    return ctx.msgEmbed(`Successfully deleted the playlist \`${playlistName}\`.`, this.client.constants.successImg)
  }

  async info(ctx, args) {
    if (!ctx.author.settings.playlist) return ctx.msgEmbed("You don't have any playlists yet!", this.client.constants.errorImg)

    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}info <playlistName>`, this.client.constants.errorImg)

    const playlistName = args.join(' ').split(';')[0]
    const page = args.join(' ').split(';')[1] || 1
    if (!playlistName) return ctx.msgEmbed("You must provide the name for the playlist you'd like to play.", this.client.constants.errorImg)

    // Get existing playlists
    let playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.msgEmbed("That playlist has doesn't exist!", this.client.constants.errorImg)
    playlist = playlist[playlistName]

    if (!playlist.songs || !playlist.songs.length) {
      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor(`by ${playlist.author.tag}`, playlist.author.avatarURL)
        .setTitle(playlist.name)
        .addField('Songs', 'No songs have been added yet!')
        .setFooter('Page 1 of 1', ctx.author.displayAvatarURL({ size: 64 }))

      return ctx.reply({ embed })
    }

    // Send information embed
    const Pagination = new FieldsEmbed()
      .setArray(playlist.songs)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setElementsPerPage(5)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
      .formatField('Songs', song => `**${playlist.songs.indexOf(song) + 1}**. [${song.title}](${song.uri})`)

    Pagination.embed
      .setColor(0x9590ee)
      .setAuthor(`by ${playlist.author.tag}`, playlist.author.avatarURL)
      .setTitle(playlist.name)
      .setThumbnail(playlist.songs[0].thumbnail)
      .setFooter(null, ctx.author.displayAvatarURL({ size: 64 }))

    if (playlist.public) Pagination.embed.setURL(`https://iturbo.cc/playlist/${ctx.author.id}/${playlist.name.replace(/ /g, '%20')}`)

    return Pagination.build()
  }

  async append(ctx, args) {
    if (!ctx.author.settings.playlist) return ctx.msgEmbed("You don't have any playlists yet!", this.client.constants.errorImg)

    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}append <playlistName>; <songURL|queue>`, this.client.constants.errorImg)

    const playlistName = args.join(' ').split('; ')[0]
    if (!playlistName) return ctx.msgEmbed("You must provide the name for the playlist you'd like to delete.", this.client.constants.errorImg)
    let songToAppend = args.join(' ').split('; ')[1]
    if (!songToAppend || ((await this.isURL(songToAppend)) === false && !['current', 'queue'].includes(songToAppend.toLowerCase()))) return ctx.msgEmbed(`Please specify what you would like to append (the currently playing song, the entire queue, or a song URL) to ${playlistName} (Cannot be a Spotify URL)`, this.client.constants.errorImg)
    let songToAppendMsg

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.msgEmbed("That playlist doesn't exist!", this.client.constants.errorImg)

    if (songToAppend.indexOf('open.spotify.com/playlist' || 'play.spotify.com/playlist') > -1) {
      return ctx.msgEmbed('Sorry, but Spotify playlists are currently disabled from being added to custom user playlists. Feel free to add individual songs though!', this.client.constants.errorImg)
    }

    const msg = await ctx.reply('Please wait, appending song(s) to playlist')
    // Append queue
    if (songToAppend && songToAppend === 'queue') {
      const player = this.client.manager.players.get(ctx.guild.id)

      if (!player) {
        return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
      }

      const tracks = player.queue.map(track => track)
      songToAppendMsg = `${tracks.length} songs`

      for (const track of tracks) {
        // Check if song is already in the playlsit
        if (playlist[playlistName].songs.indexOf(track) > -1) continue

        playlist[playlistName].songs.push(track)
      }
    } else if (songToAppend && songToAppend === 'current') {
      const player = this.client.manager.players.get(ctx.guild.id)

      if (!player) {
        return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
      }

      // Check if song is already in the playlsit
      const track = player.queue.current
      songToAppendMsg = track.title
      if (playlist[playlistName].songs.indexOf(track) > -1) return ctx.msgEmbed('That song is already in your playlist!', this.client.constants.errorImg)
      playlist[playlistName].songs.push(track)
    } else if ((await this.isURL(songToAppend)) === true) {
      if (songToAppend.indexOf('open.spotify.com' || 'play.spotify.com') > -1) {
        songToAppend = await this.handlePlaylist(ctx, songToAppend, true)
      } else {
        songToAppend = await this.handlePlaylist(ctx, songToAppend)
      }
      songToAppendMsg = songToAppend.title || `${songToAppend.length} songs`

      // Check if song is already in the playlsit
      if (playlist[playlistName].songs.indexOf(songToAppend) > -1) return ctx.msgEmbed(`That song is already in \`${playlistName}\`!`, this.client.constants.errorImg)
      // Append song to playlistName.songs array
      if (Array.isArray(songToAppend)) {
        playlist[playlistName].songs = playlist[playlistName].songs.concat(songToAppend)
      } else {
        playlist[playlistName].songs.push(songToAppend)
      }
    }

    await ctx.author.update({ playlist })

    return msg.edit(`${this.client.constants.success} Successfully appended \`${songToAppendMsg}\` to \`${playlistName}\`.`)
  }

  async remove(ctx, args) {
    if (!ctx.author.settings.playlist) return ctx.msgEmbed("You don't have any playlists yet!", this.client.constants.errorImg)

    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}remove <playlistName>; <songIndex>`, this.client.constants.errorImg)

    const playlistName = args.join(' ').split('; ')[0]
    if (!playlistName) return ctx.msgEmbed("You must provide the name for the playlist you'd like to delete.", this.client.constants.errorImg)
    const songToRemove = Number(args.join(' ').split('; ')[1])

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.msgEmbed("That playlist doesn't exist!", this.client.constants.errorImg)

    const msg = await ctx.reply('Please wait, removing song from playlist')

    if (!songToRemove) return ctx.msgEmbed(`Please specify a song number to remove from ${playlistName}! You can get it from \`${ctx.guild.settings.prefix}playlist info ${playlistName}\``, this.client.constants.errorImg)
    // Check if song is already in the playlsit
    if (!playlist[playlistName].songs[songToRemove - 1]) return ctx.msgEmbed(`That song is already in \`${playlistName}\`!`, this.client.constants.errorImg)

    const songToAppendMsg = playlist[playlistName].songs[songToRemove - 1].title

    // Append song to playlistName.songs array
    playlist[playlistName].songs.splice(songToRemove - 1, 1)

    await ctx.author.update({ playlist })

    return msg.edit(`${this.client.constants.success} Successfully removed \`${songToAppendMsg}\` from \`${playlistName}\`.`)
  }

  async play(ctx, args) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.errorImg)
    }

    if (!ctx.author.settings.playlist) return ctx.msgEmbed("You don't have any playlist yet!", this.client.constants.errorImg)

    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}playlist play <playlistName>`, this.client.constants.errorImg)

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.msgEmbed("You must provide the name for the playlist you'd like to play.", this.client.constants.errorImg)

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.msgEmbed("That playlist doesn't exist!", this.client.constants.errorImg)

    const msg = await ctx.reply('Enqueueing playlist...')

    let player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      // Create the player
      player = this.client.manager.create({
        guild: ctx.guild.id,
        voiceChannel: ctx.member.voice.channel.id,
        textChannel: ctx.channel.id,
        selfDeafen: true
      })
    }

    const tracks = []
    for (const song of playlist[playlistName].songs) {
      if (song.track) {
        const tData = await this.client.manager.decodeTrack(song.track)
        const track = TrackUtils.build(tData, ctx.author)
        tracks.push(track)
      } else {
        // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
        const res = await this.client.manager.search(`${song.author} - ${song.title}`, ctx.author)
        // Check the load type as this command is not that advanced for basics
        if (res.loadType === 'LOAD_FAILED') throw res.exception
        tracks.push(res.tracks[0])
      }
    }

    // Add playlist to queue
    this.client.emit('addList', ctx, player, playlist[playlistName])
    // Connect to the voice channel and add the track to the queue
    if (player.state.toLowerCase() !== 'connected') player.connect()
    player.queue.add(tracks)

    // Checks if the client should play the track if it's the first one added
    if (!player.playing && !player.paused) player.play()
    await msg.delete()
  }

  async shuffle(ctx, args) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.errorImg)
    }

    if (!ctx.author.settings.playlist) return ctx.msgEmbed("You don't have any playlist yet!", this.client.constants.errorImg)

    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}playlist shuffle <playlistName>`, this.client.constants.errorImg)

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.msgEmbed("You must provide the name for the playlist you'd like to play.", this.client.constants.errorImg)

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.msgEmbed("That playlist doesn't exist!", this.client.constants.errorImg)

    const msg = await ctx.reply('Enqueueing playlist...')

    let player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      // Create the player
      player = this.client.manager.create({
        guild: ctx.guild.id,
        voiceChannel: ctx.member.voice.channel.id,
        textChannel: ctx.channel.id,
        selfDeafen: true
      })
    }

    const tracks = []
    for (const song of playlist[playlistName].songs) {
      if (song.track) {
        const tData = await this.client.manager.decodeTrack(song.track)
        const track = TrackUtils.build(tData, ctx.author)
        tracks.push(track)
      } else {
        // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
        const res = await this.client.manager.search(`${song.author} - ${song.title}`, ctx.author)
        // Check the load type as this command is not that advanced for basics
        if (res.loadType === 'LOAD_FAILED') throw res.exception
        tracks.push(res.tracks[0])
      }
    }

    // Add playlist to queue
    this.client.emit('addList', ctx, player, playlist[playlistName])
    // Connect to the voice channel and add the track to the queue
    if (player.state.toLowerCase() !== 'connected') player.connect()
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[tracks[i], tracks[j]] = [tracks[j], tracks[i]]
    }
    player.queue.add(tracks)

    // Checks if the client should play the track if it's the first one added
    if (!player.playing && !player.paused) player.play()
    await msg.delete()
  }

  async share(ctx, args) {
    if (!args || !args.length) return ctx.msgEmbed(`Correct usage: ${ctx.guild.settings.prefix}playlist share <playlistName>`, this.client.constants.errorImg)
    const playlistName = args.join(' ')
    if (!playlistName) return ctx.msgEmbed('You must provide a name for the playlist.', this.client.constants.errorImg)

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.msgEmbed("That playlist doesn't exist!", this.client.constants.errorImg)

    if (playlist[playlistName].public === undefined) playlist[playlistName].public = false

    playlist[playlistName].public = !playlist[playlistName].public

    // Push changes to databse
    await ctx.author.update({ playlist })
    return ctx.msgEmbed(`Successfully set playlist \`${playlist[playlistName].name}\` to ${playlist[playlistName].public ? `to public! Share this URL with others: https://iturbo.cc/playlist/${ctx.author.id}/${playlist[playlistName].name.replace(/ /g, '%20')}` : 'to private!'}`, this.client.constants.successImg)
  }

  async import(ctx, args) {
    if (!args || !args.length) return ctx.msgEmbed(`${this.client.constants.error} Correct usage: ${ctx.guild.settings.prefix}public <playlistName>`, this.client.constants.errorImg)
    const playlistURL = args.join(' ')
    if (!playlistURL) return ctx.msgEmbed(`${this.client.constants.error} You must provide a name for the playlist.`, this.client.constants.errorImg)

    if (playlistURL.split('/playlist/')[1].split('/')[0] === ctx.author.id) return ctx.msgEmbed("You can't import your own playlist!", this.client.constants.errorImg)

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    const playlistToImport = await c(playlistURL)
      .header({
        'content-type': 'application/json',
        accept: 'application/json',
        'user-agent': this.client.utils.getUserAgent(this.client.version)
      })
      .json()
      .catch(err => {
        console.error(err)
        return false
      })

    if (!playlistToImport) {
      return ctx.msgEmbed("That playlist doesn't exist or has been set to private!", this.client.constants.successImg)
    }

    playlist[playlistToImport.name] = playlistToImport

    // Push changes to databse
    await ctx.author.update({ playlist })
    return ctx.msgEmbed(`Successfully imported playlist \`${playlistToImport.name}\`!`, this.client.constants.successImg)
  }
}

module.exports = Playlist
