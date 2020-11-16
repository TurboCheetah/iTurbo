const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class playList extends Event {
  async run (msg, queue, playlist, song) {
/*         const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('🎵 Now Playing 🎵')
      .setTitle(playlist.title)
      .setURL(playlist.url)
      .setThumbnail(playlist.thumbnail)
      .addField('Requested by', song.user, true)
      .addField('Duration', song.formattedDuration, true)
      .addField('Queue', `${queue.songs.length === 1 ? `${queue.songs.length} song` : `${queue.songs.length} songs`} - (${queue.formattedDuration})`, true)
      .addField('Volume', `${queue.volume}%`, true)
      .addField('Loop', queue.repeatMode ? queue.repeatMode == 2 ? 'All Queue' : 'This Song' : 'Off', true)
      .addField('Autoplay', queue.autoplay ? 'On' : 'Off', true)
      .addField('Enabled Filters', queue.filter || 'Off', true)
      .setFooter(`ID: ${data.id} | Requested by: ${ctx.author.tag} • Powered by HentaiList.io`, ctx.author.displayAvatarURL({ size: 32 }))
    msg.channel.send({ embed })
    msg.channel.send(`Play \`${playlist.title}\` playlist (${playlist.total_items} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`) */
    console.log(`Name: ${playlist.name}\nTitle: ${playlist.title}\nTotal: ${playlist.total_items}\nItems: ${playlist.formattedDuration}`);
  }
}

module.exports = playList
