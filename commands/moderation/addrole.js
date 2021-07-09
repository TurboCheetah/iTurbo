const Command = require('#structures/Command')

class AddRole extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/addrole:description'),
      aliases: ['arole', 'roleadd', 'giverole'],
      botPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true,
      usage: language => language('commands/moderation/addrole:usage')
    })
  }

  async run(ctx, [member, ...rolename]) {
    member = await this.verifyMember(ctx, member)
    rolename = rolename.join(' ')
    if (!rolename) return ctx.tr('commands/moderation/addrole:noRole')

    // TODO: Add some role helper.
    const role = ctx.guild.roles.cache.find(role => role.id === rolename || role.name.toLowerCase() === rolename.toLowerCase())
    if (!role) return ctx.tr('commands/moderation/addrole:doesNotExist')

    if (ctx.member.roles.highest.position <= role.position) return ctx.tr('commands/moderation/addrole:userHierarchy')
    if (role.position >= ctx.guild.me.roles.highest.position) return ctx.tr('commands/moderation/addrole:botHierarchy')

    await member.roles.add(role)

    return ctx.tr('commands/moderation/addrole:success', { role: role.name, user: member.user.tag })
  }
}

module.exports = AddRole
