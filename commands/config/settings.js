const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Settings extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('settingsDescription'),
      usage: language => language.get('settingsUsage'),
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
        .setTitle(ctx.language.get('settingsUserTitle'))
        // eslint-disable-next-line prettier/prettier
        .addField(ctx.author.settings.prefix.length > 1 ? ctx.language.get('settingsPrefixPlural') : ctx.language.get('settingsPrefix'), ctx.author.settings.prefix.length > 0 ? ctx.author.settings.prefix.map(p => `\`${p}\``).join(', ') : ctx.language.get('none'), true)

      return ctx.reply({ embed })
    }

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(ctx.guild.name, ctx.guild.iconURL({ size: 128, dynamic: true }))
      .setTitle(ctx.language.get('settingsGuildTitle'))
      .addField(ctx.language.get('settingsPrefix'), `\`${ctx.guild.settings.prefix}\``, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('settingsLevelUp'), ctx.guild.settings.levelup ? ctx.language.get('enabled') : ctx.language.get('disabled'), true)
      .addField(ctx.language.get('settingsEconomy'), ctx.guild.settings.social ? ctx.language.get('enabled') : ctx.language.get('disabled'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('settingsStarboard'), ctx.guild.settings.starboard ? ctx.guild.channels.cache.find(c => c.id === ctx.guild.settings.starboard) : ctx.language.get('disabled'), true)
      .addField(ctx.language.get('weebgreetings'), ctx.guild.settings.weebGreetings ? ctx.guild.channels.cache.find(c => c.id === ctx.guild.settings.weebGreetings) : ctx.language.get('disabled'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('djRole'), ctx.guild.settings.djRole ? ctx.guild.roles.cache.find(r => r.id === ctx.guild.settings.djRole) : ctx.language.get('disabled'), true)
      .setFooter(ctx.language.get('requestedBy', ctx.author.tag), ctx.author.displayAvatarURL({ size: 128, dynamic: true }))

    if (!ctx.guild.settings.nowplaying) embed.addField(ctx.language.get('settingsNowPlaying'), ctx.language.get('disabled'), true)
    // eslint-disable-next-line prettier/prettier
    if (ctx.guild.settings.social && (ctx.guild.settings.disabledChannels && ctx.guild.settings.disabledChannels.length > 0)) embed.addFields([{ name: this.client.constants.zws, value: this.client.constants.zws, inline: true }, { name: ctx.language.get('settingsDisabledLevelUp'), value: ctx.guild.settings.disabledChannels.map(channel => ctx.guild.channels.cache.find(c => c.id === channel)), inline: true }])
    ctx.reply({ embed })
  }
}

module.exports = Settings
