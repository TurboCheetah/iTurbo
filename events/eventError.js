const Event = require('../structures/Event.js')

class EventError extends Event {
  async run(event, err) {
    this.client.logger.error(`[EVENT] ${event.name}: ${err.stack || err}`)
    if (this.client.sentry) this.client.sentry.captureException(err)

    this.client.shard.broadcastEval(`
    const channel = this.channels.cache.get('735638949770559569')
    if (channel) {
      const { MessageEmbed } = require('discord.js')
      
      const embed = new MessageEmbed()
      .setTitle('Event Error')
      .setColor(0x9590ee)
      .setDescription('An Error occured in event: ${event.name}\\n\\n[View Stacktrace](${await this.client.utils.haste(err.stack || err)})')
    channel.send({ embed })
    }
    `)
  }
}

module.exports = EventError
