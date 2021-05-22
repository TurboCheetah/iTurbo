const Command = require('#structures/Command')

class Simp extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('simpDescription'),
      usage: language => language.get('simpUsage'),
      aliases: ['simpometer', 'simp-o-meter']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)
    if (member.user.bot) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('simpBot'))

    if (!member.user.settings.simp) {
      const percent = Math.floor(Math.random() * (100 - 1) + 1)
      await member.user.update({ simp: percent })
      return ctx.msgEmbed(ctx.language.get('simpMessage', member.user.username, percent), member.user.displayAvatarURL({ size: 128, dynamic: true }))
    }

    return ctx.msgEmbed(ctx.language.get('simpMessage', member.user.username, member.user.settings.simp), member.user.displayAvatarURL({ size: 128, dynamic: true }))
  }
}

module.exports = Simp
