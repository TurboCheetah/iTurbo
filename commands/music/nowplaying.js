const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const createBar = require('string-progressbar')

class NowPlaying extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Gets information about the currently playing song',
      aliases: ['np', 'song'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'nowplaying',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx) {
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor('🎵 Now Playing')
      .setTitle(player.queue.current.title)
      .setURL(player.queue.current.uri)
      .setThumbnail(player.queue.current.displayThumbnail('maxresdefault'))
      .addField('Requested by', player.queue.current.requester, true)
      .addField('Queue', `${player.queue.totalSize === 1 ? '1 song' : `${player.queue.totalSize} songs`} - ${this.client.utils.formatDuration(player.queue.duration)}`, true)
      .addField('Duration', `${player.queue.current.isStream ? '🔴 Live' : `\`${this.client.utils.formatDuration(player.position > 0 ? player.position : 1)}\` [${createBar(player.queue.current.duration, Math.floor(player.position > 0 ? player.position : 1), 15, '▬', '⬤')[0]}] \`${this.client.utils.formatDuration(player.queue.current.duration)}\``}`, false)
    ctx.reply({ embed })
  }
}

module.exports = NowPlaying
