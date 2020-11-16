const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class searchResult extends Event {
  async run (msg, result) {
    let i = 0
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('🎵 Search on YouTube 🎵')
      .setTitle('Choose an option below')
      .setDescription(result.map(song => `**${++i}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join('\n'))
      .setFooter('Enter anything else or wait 60 seconds to cancel')
      .setTimestamp()
    msg.channel.send({ embed })
  }
}

module.exports = searchResult
