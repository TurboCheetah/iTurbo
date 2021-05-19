const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class ServerInfo extends Command {
  constructor(...args) {
    super(...args, {
      guildOnly: true,
      aliases: ['guild', 'si', 'server'],
      description: 'Get information on the current server.',
      botPermissions: ['EMBED_LINKS']
    })

    this.verificationLevels = {
      NONE: 'None',
      LOW: 'Low',
      MEDIUM: 'Medium',
      HIGH: '(╯°□°）╯︵ ┻━┻',
      VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    }

    this.filterLevels = {
      DISABLED: 'Off',
      MEMBERS_WITHOUT_ROLES: 'No Role',
      ALL_MEMBERS: 'Everyone'
    }
  }

  async run(ctx) {
    const days = Math.floor((new Date() - ctx.guild.createdAt) / (1000 * 60 * 60 * 24))
    const bans = await ctx.guild
      .fetchBans()
      .then(bans => bans.size)
      .catch(() => "Couldn't fetch bans.")

    if (!ctx.guild.owner) await ctx.guild.members.fetch(ctx.guild.ownerID).catch(() => null)

    const embed = new MessageEmbed()
      .setAuthor(ctx.guild.name, ctx.guild.iconURL({ size: 128, dynamic: true }))
      .setColor(0x9590ee)
      .setThumbnail(ctx.guild.iconURL())
      .addField('• Creation Date', `${ctx.guild.createdAt.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} (${days} days ago!)`, false)
      .addField('• Members', `${ctx.guild.memberCount}`, true)
      .addField('• Region', ctx.guild.region, true)
      .addField('• Owner', ctx.guild.owner ? `${ctx.guild.owner.user} (${ctx.guild.owner.user.id})` : 'Failed to get owner information.', false)
      .addField('• Explicit Filter', this.filterLevels[ctx.guild.explicitContentFilter], true)
      .addField('• Verification Level', this.verificationLevels[ctx.guild.verificationLevel], true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField('• Text Channels', ctx.guild.channels.cache.filter(c => c.type === 'text').map(c => c).length, true)
      .addField('• Voice Channels', ctx.guild.channels.cache.filter(c => c.type === 'voice').map(c => c).length, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('• Roles', ctx.guild.roles.cache.size - 1, true)
      .addField('• Ban Count', bans, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .setFooter(`ID: ${ctx.guild.id}`)
    return ctx.reply({ embed })
  }
}

module.exports = ServerInfo
