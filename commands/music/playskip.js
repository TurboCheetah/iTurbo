const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class PlaySkip extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Skips the current song and plays the desired song',
      aliases: ['pskip'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'playskip <search query or URL>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')

    this.client.distube.playSkip(ctx.message, args.join(' '))
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('🎵 Now Playing')
      .setTitle(queue.songs[0].name)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      .addField('Requested by', queue.songs[0].user, true)
      .addField('Duration', `${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}`, true)
      .addField('Queue', `${queue.songs.length === 1 ? '1 song' : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
    ctx.reply({ embed })
  }
}

module.exports = PlaySkip
