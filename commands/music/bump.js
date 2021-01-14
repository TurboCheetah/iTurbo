/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Bump extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Queues the desired song before everything else',
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'bump <search query or URL> | [position]',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, args) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    const channel = ctx.member.voice.channel

    if (!channel) return ctx.reply(`${this.client.constants.error} You need to be in a voice channel to play music!`)

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

    const search = args.join(' ').split(' | ')[0]
    let position = 0
    if (args.join(' ').split(' | ')[1]) position = this.verifyInt(args.join(' ').split(' | ')[1]) - 1

    if (!ctx.member.voice.channel) return ctx.reply('Please join a voice channel!')
    if (!search.length && player.paused) {
      player.pause(false)
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }
    if (!search.length) return ctx.reply('Please give me a URL or search term to play!')

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
          player.queue.add(res.tracks[0], position)

          // Checks if the client should play the track if it's the first one added
          if (!player.playing && !player.paused && !player.queue.size) player.play()

          if (player.queue.size >= 1) return this.client.emit('addSong', player, res.tracks[0], position + 1)
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
            player.queue.add(track, position)

            // Checks if the client should play the track if it's the first one added
            if (!player.playing && !player.paused && !player.queue.size) player.play()

            if (player.queue.size >= 1) return this.client.emit('addSong', player, track, position + 1)
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
          player.queue.add(res.tracks, position)

          // Checks if the client should play the track if it's the first one added
          if (!player.playing && !player.paused) player.play()
          break
      }
    } catch (err) {
      return ctx.reply(`An error occurred while searching: ${err.message}`)
    }
  }
}

module.exports = Bump
