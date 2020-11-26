const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class songError extends Event {
  async run (msg, err) {
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('Song Error')
      .setDescription(`An Error occured: \n\`\`\`js\n${err}\`\`\``)
    msg.channel.send({ embed })
  }
}

module.exports = songError
