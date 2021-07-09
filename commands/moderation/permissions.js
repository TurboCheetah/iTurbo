const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Permissions extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/permissions:description'),
      usage: language => language('commands/moderation/permissions:usage'),
      guildOnly: true,
      aliases: ['perms'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)
    return ctx.reply(
      new MessageEmbed()
        .setTitle(ctx.translate('commands/moderation/permissions:title', { user: member.displayName, channel: ctx.channel.name, guild: ctx.guild.name }))
        .setColor(0x9590ee)
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription(
          Object.entries(ctx.channel.permissionsFor(member).serialize())
            .map(perms => `${perms[1] ? this.client.constants.emojis.success : this.client.constants.emojis.error} ${this.client.events.get('message').friendlyPerms[perms[0]]}`)
            .join('\n')
        )
    )
  }
}

module.exports = Permissions
