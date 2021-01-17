const Command = require('../../structures/Command.js')

class Simp extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['simpometer', 'simp-o-meter'],
      description: 'Based on my simp-o-meter I will determine the amount of simp you have in you',
      usage: 'simp [@user]'
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)
    if (member.user.bot) return ctx.reply(`${this.client.constants.emojis.error} Bots aren't simps :(`)

    if (!member.user.settings.simp) {
      const percent = Math.floor(Math.random() * (100 - 1) + 1)
      await member.user.update({ simp: percent })
      return ctx.msgEmbed(`${member.user.username} is ${percent}% simp!`, member.user.displayAvatarURL({ size: 512, dynamic: true }))
    }

    return ctx.msgEmbed(`${member.user.username} is ${member.user.settings.simp}% simp!`, member.user.displayAvatarURL({ size: 512, dynamic: true }))
  }
}

module.exports = Simp
