const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class EventError extends Event {
  async run(event, err) {
    const channel = this.client.channels.cache.get('735638949770559569')
    if (!channel) return
    const embed = new MessageEmbed()
      .setTitle('Event Error')
      .setDescription(`An Error occured in event: ${event.name}\n\`\`\`js\n${err.stack || err}\`\`\``)
      .setColor(0x9590ee)
    return channel.send({ embed }).catch(() => null)
  }
}

module.exports = EventError
