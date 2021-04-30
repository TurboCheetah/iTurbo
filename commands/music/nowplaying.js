const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class NowPlaying extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Gets information about the currently playing song',
      aliases: ['np', 'song'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'nowplaying [song]',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, [song]) {
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    if (!song) {
      const url = player.queue.current.uri.startsWith('https://youtube.com/watch?v=') || player.queue.current.uri.startsWith('https://www.youtube.com/watch?v=') ? `${player.queue.current.uri}&t=${(this.client.manager.players.get(ctx.guild.id).position / 1000).toFixed()}s` : player.queue.current.uri

      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor('🎵 Now Playing')
        .setTitle(player.queue.current.title)
        .setURL(player.queue.current.uri)
        .setThumbnail(player.queue.current.displayThumbnail('maxresdefault'))
        .addField('Requested by', player.queue.current.requester, true)
        .addField('Queue', `${player.queue.totalSize === 1 ? '1 song' : `${player.queue.totalSize} songs`} - ${this.client.utils.formatDuration(player.queue.duration)}`, true)
        .addField('Duration', `${player.queue.current.isStream ? '🔴 Live' : `[${this.client.utils.createBar(player.queue.current.duration, Math.floor(player.position > 0 ? player.position : 1), 15, '▬', this.client.constants.emojis.dance, url)[0]}] **${this.client.utils.formatDuration(player.position > 0 ? player.position : 1)}/${this.client.utils.formatDuration(player.queue.current.duration)}**`}`, false)
      return ctx.reply({ embed })
    }

    song = this.verifyInt(song, 1) - 1

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor('🎵 Song Info')
      .setTitle(player.queue[song].title)
      .setURL(player.queue[song].uri)
      .setThumbnail(player.queue[song].displayThumbnail('maxresdefault'))
      .addField('Requested by', player.queue[song].requester, true)
      .addField('Position in Queue', `${song + 1}/${player.queue.totalSize}`, true)
      .addField('Duration', player.queue[song].isStream ? '🔴 Live' : this.client.utils.formatDuration(player.queue[song].duration), false)
    ctx.reply({ embed })
  }
}

module.exports = NowPlaying
