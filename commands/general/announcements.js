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
      .setTitle('Bot announcement')
      // .setAuthor(announcement.author.username, announcement.author.displayAvatarURL({ size: 64, dynamic: true }))
      .setDescription(announcement.cleanContent)
      // .setThumbnail(announcement.author.displayAvatarURL({ size: 512, dynamic: true }))
      .setTimestamp(new Date(announcement.createdTimestamp))
      .setFooter(`From Turbo's Hub (run ${ctx.guild ? ctx.guild.settings.prefix : '|'}support to join us)`)
      .setColor(0x9590ee)

    return ctx.reply({ embed })
  }
}

module.exports = Announcements
