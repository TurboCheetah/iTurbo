const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class addSong extends Event {
  async run (msg, queue, song) {
    /*     const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(':musical_note: Playing :musical_note:')
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(data.cover_url)
      .addField('Requested by', song.user, true)
      .addField('Duration', song.formattedDuration, true)
      .addField('Queue', `${queue.songs.length === 1 ? `${queue.songs.length} song` : `${queue.songs.length} songs`} - (${queue.formattedDuration})`, true)
      .addField('Volume', `${queue.volume}%`, true)
      .addField('Loop', queue.repeatMode ? queue.repeatMode == 2 ? 'All Queue' : 'This Song' : 'Off', true)
      .addField('Autoplay', queue.autoplay ? 'On' : 'Off', true)
      .addField('Enabled Filters', queue.filter || 'Off', true)
      .setFooter(`ID: ${data.id} | Requested by: ${ctx.author.tag} • Powered by HentaiList.io`, ctx.author.displayAvatarURL({ size: 32 }))
    msg.channel.send({ embed }) */
    msg.channel.send(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
  }
}

module.exports = addSong
