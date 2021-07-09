const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Settings extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/config/settings:description'),
      usage: language => language('commands/config/settings:usage'),
      aliases: ['config'],
      botPermissions: ['EMBED_LINKS'],
      cooldown: 3
    })
  }

  async run(ctx, args) {
    if (!ctx.guild || args[0] === 'user' || ctx.flags.user) {
      const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setTitle(ctx.translate('commands/config/settings:userTitle'))
        // eslint-disable-next-line prettier/prettier
        .addField(ctx.author.settings.prefix.length > 1 ? ctx.translate('commands/config/settings:prefixPlural') : ctx.translate('commands/config/settings:prefix'), ctx.author.settings.prefix.length > 0 ? ctx.author.settings.prefix.map(p => `\`${p}\``).join(', ') : ctx.translate('common:none'), true)

      return ctx.reply({ embed })
    }

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(ctx.guild.name, ctx.guild.iconURL({ size: 128, dynamic: true }))
      .setTitle(ctx.translate('commands/config/settings:guildTitle'))
      .addField(ctx.translate('commands/config/settings:prefix'), `\`${ctx.guild.settings.prefix}\``, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('commands/config/settings:levelUp'), ctx.guild.settings.levelup ? ctx.translate('enabled') : ctx.translate('disabled'), true)
      .addField(ctx.translate('commands/config/settings:economy'), ctx.guild.settings.social ? ctx.translate('enabled') : ctx.translate('disabled'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('commands/config/settings:starboard'), ctx.guild.settings.starboard ? ctx.guild.channels.cache.find(c => c.id === ctx.guild.settings.starboard) : ctx.translate('disabled'), true)
      .addField(ctx.translate('common:weebgreetings'), ctx.guild.settings.weebGreetings ? ctx.guild.channels.cache.find(c => c.id === ctx.guild.settings.weebGreetings) : ctx.translate('disabled'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('common:djRole'), ctx.guild.settings.djRole ? ctx.guild.roles.cache.find(r => r.id === ctx.guild.settings.djRole) : ctx.translate('disabled'), true)
      .setFooter(ctx.translate('common:requestedBy', { requester: ctx.author.tag }), ctx.author.displayAvatarURL({ size: 128, dynamic: true }))

    if (!ctx.guild.settings.nowplaying) embed.addField(ctx.translate('commands/config/settings:nowPlaying'), ctx.translate('disabled'), true)
    // eslint-disable-next-line prettier/prettier
    if (ctx.guild.settings.social && (ctx.guild.settings.disabledChannels && ctx.guild.settings.disabledChannels.length > 0)) embed.addFields([{ name: this.client.constants.zws, value: this.client.constants.zws, inline: true }, { name: ctx.translate('commands/config/settings:disabledLevelUp'), value: ctx.guild.settings.disabledChannels.map(channel => ctx.guild.channels.cache.find(c => c.id === channel)), inline: true }])
    ctx.reply({ embed })
  }
}

module.exports = Settings
