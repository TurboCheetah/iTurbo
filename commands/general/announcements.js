const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Announcements extends Command {
  constructor(...args) {
    super(...args, {
      name: 'announcements',
      description: 'Get bot related announcements.',
      usage: 'announcements',
      aliases: ['announce', 'news'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const guild = this.client.guilds.cache.get('221013455342141440')
    const channel = guild.channels.cache.get('735634944566493184')
    const messages = await channel.messages.fetch({ limit: 1 })
    const announcement = messages.first()

    const embed = new MessageEmbed()
      .setTitle('Bot announcement')
      .setAuthor(announcement.author.username, announcement.author.displayAvatarURL({ size: 64 }))
      .setDescription(announcement.cleanContent)
      .setThumbnail(announcement.author.displayAvatarURL({ size: 512 }))
      .setTimestamp(new Date(announcement.createdTimestamp))
      .setFooter(`From Turbo's Hub (run ${ctx.guild ? ctx.guild.settings.prefix : '|'}support to join us)`)
      .setColor(0x9590ee)

    return ctx.reply({ embed })
  }
}

module.exports = Announcements
