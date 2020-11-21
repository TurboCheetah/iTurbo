const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Skip extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Skips the current song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'skip',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx) {
    this.client.distube.skip(ctx.message)

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

module.exports = Skip
