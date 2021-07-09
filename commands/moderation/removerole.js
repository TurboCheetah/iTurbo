const Command = require('#structures/Command')

class RemoveRole extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/removerole:description'),
      usage: language => language('commands/moderation/removerole:usage'),
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true,
      botPermissions: ['MANAGE_ROLES'],
      aliases: ['roleremove', 'rrole', 'takerole']
    })
  }

  async run(ctx, [member, ...rolename]) {
    member = await this.verifyMember(ctx, member)
    rolename = rolename.join(' ')
    if (!rolename) return ctx.tr('commands/moderation/removerole:noRole')

    const role = ctx.guild.roles.cache.find(role => role.id === rolename || role.name.toLowerCase() === rolename.toLowerCase())

    if (!role) return ctx.tr('commands/moderation/removerole:doesNotExist')

    if (ctx.member.roles.highest.position <= role.position) return ctx.tr('commands/moderation/removerole:userHierarchy')
    if (ctx.guild.me.roles.highest.position <= role.position) return ctx.tr('commands/moderation/removerole:botHierarchy')

    await member.roles.remove(role)

    return ctx.tr('commands/moderation/removerole:success', { role: role.name, user: member.user.tag })
  }
}

module.exports = RemoveRole
