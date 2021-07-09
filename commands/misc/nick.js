const Command = require('#structures/Command')

class Nick extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/misc/nick:description'),
      botPermissions: ['MANAGE_NICKNAMES'],
      userPermissions: ['MANAGE_NICKNAMES'],
      usage: language => language('commands/misc/nick:usage'),
      guildOnly: true,
      aliases: ['nickname', 'changenickname', 'changenick', 'setnick', 'setnickname']
    })
  }

  async run(ctx, [member, ...nick]) {
    if (member === 'me') member = ctx.member
    else if (member === 'you') member = ctx.guild.me
    else member = await this.verifyMember(ctx, member)

    if (!nick.length) return ctx.tr('commands/misc/nick:noNick')
    nick = nick.join(' ')

    if (nick.length >= 32) return ctx.tr('commands/misc/nick:exceedsLength')
    if (member.roles.highest.position > ctx.guild.me.roles.highest.position) {
      return ctx.tr('commands/misc/nick:hierarchy')
    }

    await member.edit({ nick })
    return ctx.tr('commands/misc/nick:success', {
      user: member === ctx.guild.me ? 'my' : member === ctx.member ? 'your' : `${member.user.username}'s`,
      nick
    })
  }
}

module.exports = Nick
