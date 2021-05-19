/* eslint-disable no-case-declarations */
const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Play extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Plays the desired song',
      aliases: ['p'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'play <search | youtube | soundcloud | spotify | URL>',
      arguments: {
        search: 'YouTube search query',
        youtube: 'YouTube URL',
        soundcloud: 'SoundCloud URL',
        spotify: 'Spotify URL',
        URL: 'Direct HTTP URL'
      },
      examples: {
        'https://www.youtube.com/watch?v=fudsUhWAG_o': 'Plays the YouTube Video',
        'https://soundcloud.com/lil_peep/lil-jeep-prod-cian-p': 'Fetches info and plays the song from SoundCloud',
        'lil peep - gym class': 'Searches "lil peep - gym class" on YouTube and adds it to queue'
      },
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, args) {
    this.client.utils.isDJ(ctx)

    const channel = ctx.member.voice.channel

    if (!channel) return ctx.msgEmbed('You need to be in a voice channel to play music!', this.client.constants.errorImg)

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

    const search = args.join(' ')

    if (!ctx.member.voice.channel) return ctx.msgEmbed('Please join a voice channel!', this.client.constants.errorImg)
    if (!search.length && player.paused) {
      player.pause(false)
      return ctx.msgEmbed('▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512, dynamic: true }))
    }
    if (!search.length) return ctx.msgEmbed('Please give me a URL or search term to play!', this.client.constants.errorImg)

    let res

    try {
      // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
      res = await this.client.manager.search(search, ctx.author)
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === 'LOAD_FAILED') throw res.exception
      switch (res.loadType) {
        case 'TRACK_LOADED':
          // Connect to the voice channel and add the track to the queue
          if (player.state.toLowerCase() !== 'connected') player.connect()
          player.queue.add(res.tracks[0])

          // Checks if the client should play the track if it's the first one added
          if (!player.playing && !player.paused && !player.queue.size) player.play()

          if (player.queue.size >= 1) return this.client.emit('addSong', player, res.tracks[0])
          break

        case 'SEARCH_RESULT':
          let i = 0
          const tracks = res.tracks.slice(0, 10)
          const embed = new MessageEmbed()
            .setColor(0x9590ee)
            .setAuthor('🎵 Search on YouTube 🎵', ctx.author.displayAvatarURL)
            .setTitle('Choose an option below')
            .setDescription(tracks.map(track => `**${++i}**. [${track.title}](${track.uri}) - \`${this.client.utils.formatDuration(track.duration)}\``).join('\n'))
            .setFooter('Respond with cancel or wait 60 seconds to cancel')
            .setTimestamp()

          const filter = msg => msg.author.id === ctx.author.id
          const response = await ctx.message.awaitReply('', filter, 60000, embed, true)
          if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

          if (/^(10|[1-9])$/i.test(response)) {
            const track = tracks[Number(response) - 1]
            // Connect to the voice channel and add the track to the queue
            if (player.state.toLowerCase() !== 'connected') player.connect()
            player.queue.add(track)

            // Checks if the client should play the track if it's the first one added
            if (!player.playing && !player.paused && !player.queue.size) player.play()

            if (player.queue.size >= 1) return this.client.emit('addSong', player, track)
          } else if (['cancel'].includes(response)) {
            ctx.reply('Operation cancelled.')
          } else {
            ctx.reply('Invalid response, please try again.')
          }

          break

        case 'PLAYLIST_LOADED':
          this.client.emit('addList', ctx, player, res)
          // Connect to the voice channel and add the track to the queue
          if (player.state.toLowerCase() !== 'connected') player.connect()
          player.queue.add(res.tracks)

          // Checks if the client should play the track if it's the first one added
          if (!player.playing && !player.paused) player.play()
          break
      }
    } catch (err) {
      return ctx.msgEmbed(`An error occurred while searching: ${err.message}`, this.client.constants.errorImg)
    }
  }
}

module.exports = Play
