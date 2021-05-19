const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      description: "View your profile or someone's",
      usage: 'profile [@user]',
      guildOnly: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)
    if (member.user.bot) return ctx.reply("You can't view a bot's profile.")

    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s profile`)
      .setDescription(member.user.settings.title || `No Title set yet, use \`${ctx.guild.settings.prefix}title\` to set one`)
      .setColor(0x9590ee)
      .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 64, dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('Level', member.settings.level)
      .addField('Points', `¥${parseInt(member.settings.points).toLocaleString()}`)
      .addField('Reputation Points', member.user.settings.reputation)
    return ctx.reply({ embed })
  }
}

module.exports = Profile
