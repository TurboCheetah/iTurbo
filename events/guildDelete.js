const Event = require('#structures/Event')

class GuildDelete extends Event {
  async run(guild) {
    // If the guild went unavailable don't do anything.
    if (!guild.available) return

    // Delete guild settings.
    await this.client.settings.guilds.delete(guild.id).catch(() => null)

    this.client.shard.broadcastEval(`
    const channel = this.channels.cache.get('735636902102827108')
    if (channel) {
      const { MessageEmbed } = require('discord.js')
      
      const embed = new MessageEmbed()
      .setTitle('iTurbo left a server.')
      .setDescription('${guild.name}')
      .setColor(0x9590ee)
      .setThumbnail('${guild.iconURL()}')
      .addField('Owner', "${guild.owner ? guild.owner.user.tag : 'Failed to fetch owner information.'}")
      .addField('Member Count', '${guild.memberCount}')
      .setFooter('${guild.id}')
    channel.send({ embed })
    }
    `)
  }
}

module.exports = GuildDelete
