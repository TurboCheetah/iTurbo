const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Bug extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Found a bug? report with this.',
      cooldown: 60,
      usage: 'bug <report>',
      aliases: ['reportbug', 'bugreport'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription('Please describe the bug as best as you can.')
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (response) {
        await this.client.shard.broadcastEval(`
        const channel = this.channels.cache.get('735638645486125167')
        if (channel) {
          const { MessageEmbed } = require('discord.js')
    
          const embed = new MessageEmbed()
          .setTitle('Bug Report')
          .setDescription('${args.join(' ')}')
          .setColor(0x9590ee)
          .setAuthor('${ctx.author.tag}', '${ctx.author.displayAvatarURL({ size: 64, dynamic: true })}')
          .setFooter('${ctx.author.id}')
    
        channel.send({ embed })
        }
        `)

        return ctx.reply(`Your bug report has been sent${ctx.guild && ctx.guild.id === this.client.constants.mainGuildID ? '' : ' to the support server.'} You will hear back from my owner in DMs if there is anything wrong with your report. Have a nice day!`)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply('Operation cancelled.')
      }
    }
    await this.client.shard.broadcastEval(`
    const channel = this.channels.cache.get('735638645486125167')
    if (channel) {
      const { MessageEmbed } = require('discord.js')

      const embed = new MessageEmbed()
      .setTitle('Bug Report')
      .setDescription('${args.join(' ')}')
      .setColor(0x9590ee)
      .setAuthor('${ctx.author.tag}', '${ctx.author.displayAvatarURL({ size: 64, dynamic: true })}')
      .setFooter('${ctx.author.id}')

    channel.send({ embed })
    }
    `)

    return ctx.reply(`Your bug report has been sent${ctx.guild && ctx.guild.id === this.client.constants.mainGuildID ? '' : ' to the support server.'} You will hear back from my owner in DMs if there is anything wrong with your report. Have a nice day!`)
  }
}

module.exports = Bug
