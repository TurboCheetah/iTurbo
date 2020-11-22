const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Simp extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Based on my simp-scale I will determine the amount of simp you have in you',
      usage: 'simp [@user]'
    })
  }

  async run (ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)
    if (member.user.bot) return ctx.reply(`${this.client.constants.error} Bots aren't simps :(`)

    if (!member.user.settings.simp) {
      const percent = Math.floor(Math.random() * (100 - 1) + 1)
      await member.user.update({ simp: percent })
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor(`| ${member.user.username} is ${percent}% simp!`, member.user.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| ${member.user.username} is ${member.user.settings.simp}% simp!`, member.user.displayAvatarURL({ size: 512 }))
    return ctx.reply({ embed })
  }
}

module.exports = Simp
