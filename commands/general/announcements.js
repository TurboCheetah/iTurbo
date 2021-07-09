const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Announcements extends Command {
  constructor(...args) {
    super(...args, {
      name: 'announcements',
      description: language => language('commands/general/announcements:description'),
      aliases: ['announce', 'news'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const announcement = (
      await this.client.shard.broadcastEval(`
      const guild = this.guilds.cache.get('221013455342141440')
      if (guild) {
        const channel = this.channels.cache.get('735634944566493184')
        if (channel) {
          channel.messages.fetch({ limit: 1 }).then(messages => messages.first())
        }
      }
    `)
    ).filter(output => output)[0]

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(ctx.translate('commands/general/announcements:title'))
      // .setAuthor(announcement.author.username, announcement.author.displayAvatarURL({ size: 64, dynamic: true }))
      .setDescription(announcement.cleanContent)
      // .setThumbnail(announcement.author.displayAvatarURL({ size: 512, dynamic: true }))
      .setTimestamp(new Date(announcement.createdTimestamp))
      .setFooter(ctx.translate('commands/general/announcements:footer', { prefix: ctx.guild ? ctx.guild.settings.prefix : '|' }))

    return ctx.reply({ embed })
  }
}

module.exports = Announcements
