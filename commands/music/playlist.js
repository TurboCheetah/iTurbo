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
      usage: 'playlist <create|delete|append|remove|info|share|import|list:default> [playlist]',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [action = 'list', ...args]) {
    if (!['list', 'create', 'delete', 'info', 'append', 'remove', 'play', 'share', 'import'].includes(action)) return ctx.reply(`Usage: \`${ctx.guild.prefix}${this.usage}\``)

    return this[action](ctx, args)
  }

  async isURL(string) {
    try {
      URL(string)
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
        return ctx.reply(`An error occurred while searching: ${err.message}`)
      }
      return res
    }
    return args
  }

  async list(ctx) {
    if (!ctx.author.settings.playlist) return ctx.reply("You don't have any playlists yet!")

    const embed = new MessageEmbed()
      .setTitle('Playlists')
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setColor(0x9590ee)
      .setDescription(
        Object.keys(ctx.author.settings.playlist)
          .map(playlist => `• ${playlist}`)
          .join('\n')
      )

    return ctx.reply({ embed })
  }

  async create(ctx, args) {
    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}create <playlistName>`)
    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply('You must provide a name for the playlist.')

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if (playlistName.length > 35) return ctx.reply('Playlist name cannot be longer than 35 characters!')

    // Get existing playlsits to append to.
    const playlist = ctx.author.settings.playlist || {}

    // Avoid duplicates.
    if (playlist[playlistName]) return ctx.reply('That playlist has already been created.')

    // Create new object with playlistName as the key
    playlist[playlistName] = {
      name: playlistName,
      author: ctx.author,
      public: false,
      songs: []
    }

    // Push changes to databse
    await ctx.author.update({ playlist })
    return ctx.reply(`${this.client.constants.success} Successfully created playlist \`${playlistName}\`! Use \`${ctx.guild.settings.prefix}playlist append ${playlistName}; <songURL|queue>\` to add some songs`)
  }

  async delete(ctx, args) {
    if (!ctx.author.settings.playlist) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}delete <playlistName>`)

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply("You must provide the name for the playlist you'd like to delete.")

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    // Delete playlistName object from playlists "array"
    delete playlist[playlistName]

    await ctx.author.update({ playlist })

    return ctx.reply(`${this.client.constants.success} Successfully deleted the playlist \`${playlistName}\`.`)
  }

  async info(ctx, args) {
    if (!ctx.author.settings.playlist) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}info <playlistName>`)

    const playlistName = args.join(' ').split(';')[0]
    const page = args.join(' ').split(';')[1] || 1
    if (!playlistName) return ctx.reply("You must provide the name for the playlist you'd like to play.")

    // Get existing playlists
    let playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist has doesn't exist!`)
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
    if (!ctx.author.settings.playlist) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}append <playlistName>; <songURL|queue>`)

    const playlistName = args.join(' ').split('; ')[0]
    if (!playlistName) return ctx.reply("You must provide the name for the playlist you'd like to delete.")
    let songToAppend = args.join(' ').split('; ')[1]
    if (!songToAppend || ((await this.isURL(songToAppend)) === false && !['current', 'queue'].includes(songToAppend.toLowerCase()))) return ctx.reply(`Please specify what you would like to append (the currently playing song, the entire queue, or a song URL) to ${playlistName} (Cannot be a Spotify URL)`)
    let songToAppendMsg

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    if (songToAppend.indexOf('open.spotify.com/playlist' || 'play.spotify.com/playlist') > -1) {
      return ctx.reply('Sorry, but Spotify playlists are currently disabled from being added to custom user playlists. Feel free to add individual songs though!')
    }

    const msg = await ctx.reply('Please wait, appending song(s) to playlist')
    // Append queue
    if (songToAppend && songToAppend === 'queue') {
      const player = this.client.manager.players.get(ctx.guild.id)

      if (!player) {
        const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
        return msg.edit({ embed })
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
        const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
        return msg.edit({ embed })
      }

      // Check if song is already in the playlsit
      const track = player.queue.current
      songToAppendMsg = track.title
      if (playlist[playlistName].songs.indexOf(track) > -1) return ctx.reply(`${this.client.constants.error} That song is already in your playlist!`)
      playlist[playlistName].songs.push(track)
    } else if ((await this.isURL(songToAppend)) === true) {
      if (songToAppend.indexOf('open.spotify.com' || 'play.spotify.com') > -1) {
        songToAppend = await this.handlePlaylist(ctx, songToAppend, true)
      } else {
        songToAppend = await this.handlePlaylist(ctx, songToAppend)
      }
      songToAppendMsg = songToAppend.title || `${songToAppend.length} songs`

      // Check if song is already in the playlsit
      if (playlist[playlistName].songs.indexOf(songToAppend) > -1) return ctx.reply(`That song is already in \`${playlistName}\`!`)
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
    if (!ctx.author.settings.playlist) return ctx.reply("You don't have any playlists yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}remove <playlistName>; <songIndex>`)

    const playlistName = args.join(' ').split('; ')[0]
    if (!playlistName) return ctx.reply("You must provide the name for the playlist you'd like to delete.")
    const songToRemove = Number(args.join(' ').split('; ')[1])

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    const msg = await ctx.reply('Please wait, removing song from playlist')

    if (!songToRemove) return ctx.reply(`Please specify a song number to remove from ${playlistName}! You can get it from \`${ctx.guild.settings.prefix}playlist info ${playlistName}\``)
    // Check if song is already in the playlsit
    if (!playlist[playlistName].songs[songToRemove - 1]) return ctx.reply(`That song is already in \`${playlistName}\`!`)

    const songToAppendMsg = playlist[playlistName].songs[songToRemove - 1].title

    // Append song to playlistName.songs array
    playlist[playlistName].songs.splice(songToRemove - 1, 1)

    await ctx.author.update({ playlist })

    return msg.edit(`${this.client.constants.success} Successfully removed \`${songToAppendMsg}\` from \`${playlistName}\`.`)
  }

  async play(ctx, args) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    if (!ctx.author.settings.playlist) return ctx.reply("You don't have any playlist yet!")

    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}playlist play <playlistName>`)

    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply("You must provide the name for the playlist you'd like to play.")

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

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
    if (ctx.message.deletable) await ctx.message.delete()
    await msg.delete()
  }

  async share(ctx, args) {
    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}playlist share <playlistName>`)
    const playlistName = args.join(' ')
    if (!playlistName) return ctx.reply('You must provide a name for the playlist.')

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    if (!playlist[playlistName]) return ctx.reply(`${this.client.constants.error} That playlist doesn't exist!`)

    if (playlist[playlistName].public === undefined) playlist[playlistName].public = false

    playlist[playlistName].public = !playlist[playlistName].public

    // Push changes to databse
    await ctx.author.update({ playlist })
    return ctx.reply(`${this.client.constants.success} Successfully set playlist \`${playlist[playlistName].name}\` to ${playlist[playlistName].public ? `to public! Share this URL with others: https://iturbo.cc/playlist/${ctx.author.id}/${playlist[playlistName].name.replace(/ /g, '%20')}` : 'to private!'}`)
  }

  async import(ctx, args) {
    if (!args || !args.length) return ctx.reply(`Correct usage: ${ctx.guild.settings.prefix}public <playlistName>`)
    const playlistURL = args.join(' ')
    if (!playlistURL) return ctx.reply('You must provide a name for the playlist.')

    // if (playlistURL.split('/playlist/')[1].split('/')[0] === ctx.author.id) return ctx.reply("You can't import your own playlist!")

    // Get existing playlists
    const playlist = ctx.author.settings.playlist || {}

    const playlistToImport = await c(playlistURL)
      .header({
        'content-type': 'application/json',
        accept: 'application/json'
      })
      .json()
      .catch(err => {
        console.error(err)
        return false
      })

    if (!playlistToImport) {
      return ctx.reply(`${this.client.constants.error} That playlist doesn't exist or has been set to private!`)
    }

    playlist[playlistToImport.name] = playlistToImport

    // Push changes to databse
    await ctx.author.update({ playlist })
    return ctx.reply(`${this.client.constants.success} Successfully imported playlist \`${playlistToImport.name}\`!`)
  }
}

module.exports = Playlist
