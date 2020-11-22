const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class addList extends Event {
  async run (msg, queue, playlist) {
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`${this.client.constants.add} Added playlist`)
      .setTitle(playlist.name)
      .setURL(playlist.url)
      .setThumbnail(playlist.thumbnail)
      .addField('Requested by', playlist.user, true)
      .addField('Length', `${playlist.songs.length === 1 ? '1 song' : `${playlist.songs.length} songs`} - ${playlist.formattedDuration}`, true)
      .addField('Queue', `${queue.songs.length === 1 ? '1 song' : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
    msg.channel.send({ embed })
  }
}

module.exports = addList
