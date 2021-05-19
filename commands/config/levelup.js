const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class LevelUp extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enable/Disable Level up messages.',
      aliases: ['levelupmessages', 'levelmessage', 'lvlmsg', 'lvlupmessages'],
      userPermissions: ['MANAGE_GUILD'],
      usage: 'levelup <enable/disable>',
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action || !['enable', 'disable'].includes(action)) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription('Do you want me to disable or enable levelup messages?')
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (['enable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ levelup: true })
        return ctx.reply(`${this.client.constants.emojis.success} Successfully enabled level up messages.`)
      } else if (['disable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ levelup: false })
        return ctx.reply(`${this.client.constants.emojis.success} Successfully disabled level up messages.`)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply('Operation cancelled.')
      }
    }

    if (action === 'enable') {
      await ctx.guild.update({ levelup: true })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully enabled level up messages.`)
    }

    if (action === 'disable') {
      await ctx.guild.update({ levelup: false })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully disabled level up messages.`)
    }
  }
}

module.exports = LevelUp
