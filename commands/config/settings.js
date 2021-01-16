const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Settings extends Command {
  constructor(...args) {
    super(...args, {
      description: "View either the guild's or your own settings",
      aliases: ['config'],
      botPermissions: ['EMBED_LINKS'],
      usage: 'settings [user]',
      cooldown: 3
    })
  }

  async run(ctx, args) {
    if (!ctx.guild || args[0] === 'user') {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setTitle('User settings')
        .setColor(0x9590ee)
        // eslint-disable-next-line prettier/prettier
        .addField(ctx.author.settings.prefix.length > 1 ? 'Prefixes' : 'Prefix', ctx.author.settings.prefix.length > 0 ? ctx.author.settings.prefix.map(p => `\`${p}\``).join(', ') : 'None set', true)

      return ctx.reply({ embed })
    }

    const embed = new MessageEmbed()
      .setAuthor(ctx.guild.name, ctx.guild.iconURL({ size: 128, dynamic: true }))
      .setTitle('Guild settings')
      .setColor(0x9590ee)
      .addField('Prefix', `\`${ctx.guild.settings.prefix}\``, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Level Up Messages', ctx.guild.settings.levelup ? 'Enabled' : 'Disabled', true)
      .addField('Economy System', ctx.guild.settings.social ? 'Enabled' : 'Disabled', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Starboard', ctx.guild.settings.starboard ? ctx.guild.channels.cache.find(c => c.id === ctx.guild.settings.starboard) : 'Disabled', true)
      .addField('Weeb Greetings', ctx.guild.settings.weebGreetings ? ctx.guild.channels.cache.find(c => c.id === ctx.guild.settings.weebGreetings) : 'Disabled', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('DJ Role', ctx.guild.settings.djRole ? ctx.guild.roles.cache.find(r => r.id === ctx.guild.settings.djRole) : 'Disabled', true)
      .setFooter(`Requested by ${ctx.author.tag}`, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))

    if (!ctx.guild.settings.nowplaying) embed.addField('Now Playing Notifications', 'Disabled', true)
    // eslint-disable-next-line prettier/prettier
    if (ctx.guild.settings.social && (ctx.guild.settings.disabledChannels && ctx.guild.settings.disabledChannels.length > 0)) embed.addField('Disabled Level Up Channels', ctx.guild.settings.disabledChannels.map(channel => ctx.guild.channels.cache.find(c => c.id === channel)), false)
    ctx.reply({ embed })
  }
}

module.exports = Settings
