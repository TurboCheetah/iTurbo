const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const ms = require('ms')

class Giveaway extends Command {
  constructor (...args) {
    super(...args, {
      aliases: ['catfact', 'kittenfact'],
      cooldown: 3,
      description: 'Let me tell you a misterious cat fact.',
      usage: 'giveaway <start <channel> <duration> <winnerCount> <prize>|end <messageID> |reroll <messageID>>',
      userPermissions: ['MANAGE_GUILD'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, [action, ...args]) {
    if (!['start', 'end', 'reroll'].includes(action)) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64 }))
        .setDescription('What would you like to do? Please reply with **start**, **end**, or **reroll**.\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.')
        .setTimestamp()
        .setColor(0x9590EE)

      const filter = (msg) => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Timed out.')

      if (['start'].includes(response.toLowerCase())) {
        return this.start(ctx, args)
      } else if (['end'].includes(response)) {
        return this.end(ctx, args)
      } else if (['reroll'].includes(response)) {
        return this.reroll(ctx, args)
      } else if (['cancel'].includes(response)) {
        return ctx.reply('Operation cancelled.')
      } else {
        return ctx.reply('Invalid response, please try again.')
      }
    }

    return this[action](ctx, args)
  }

  async start (ctx, args) {
    const giveawayChannel = ctx.message.mentions.channels.first()

    if (!giveawayChannel) {
      return ctx.reply(`${this.client.constants.error} No channel specified. Please mention a valid channel.\nCorrect usage: \`${ctx.guild.prefix}${this.usage}\``)
    }

    const duration = args[1]

    if (!duration || isNaN(ms(duration))) {
      return ctx.reply(`${this.client.constants.error} Invalid duraiton specified. Please specify a valid duration, e.g 24h.\nCorrect usage: \`${ctx.guild.prefix}${this.usage}\``)
    }

    const winners = args[2]

    if (!winners || isNaN(winners) || (parseInt(winners) <= 0)) {
      return ctx.reply(`${this.client.constants.error} Invalid winner count. Please specify a valid amount of giveaway winners.\nCorrect usage: \`${ctx.guild.prefix}${this.usage}\``)
    }

    const prize = args[3]

    if (!prize) {
      return ctx.reply(`${this.client.constants.error} No prize specified! Please specify a valid prize.\nCorrect usage: \`${ctx.guild.prefix}${this.usage}\``)
    }

    ctx.reply(`🎉 Started giveaway in ${giveawayChannel}! 🎉`)

    this.client.giveawaysManager.start(giveawayChannel, {
      time: ms(duration),
      prize: prize,
      winnerCount: winners,
      hostedBy: ctx.author,
      messages: {
        giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
        giveawayEnded: '🎉🎉 **GIVEAWAY ENDED** 🎉🎉',
        timeRemaining: 'Time remaining: **{duration}**!',
        inviteToParticipate: 'React with 🎉 to participate!',
        winMessage: 'Congratulations, {winners}! You won **{prize}**!',
        embedFooter: 'Giveaways',
        noWinner: 'Giveaway ended with no valid participations.',
        hostedBy: 'Hosted by: {user}',
        winners: 'winner(s)',
        endedAt: 'Ended at',
        units: {
          seconds: 'seconds',
          minutes: 'minutes',
          hours: 'hours',
          days: 'days',
          pluralS: false
        }
      }
    })
  }

  async end (ctx, args) {
    if (!args[0]) {
      return ctx.reply(`${this.client.constants.error} You need to specify a valid message ID!\nCorrect usage: \`${ctx.guild.prefix}${this.usage}\``)
    }

    const giveaway = this.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || this.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0])

    if (!giveaway) {
      return ctx.reply(`${this.client.constants.error} Unable to find a giveaway with ID \`${args[0]}\``)
    }

    this.client.giveawaysManager.edit(giveaway.messageID, {
      setEndTimestamp: Date.now()
    }).then(() => {
      ctx.reply(`Giveaway will end in less than ${(this.client.giveawaysManager.options.updateCountdownEvery / 1000)} seconds!`)
    }).catch((e) => {
      if (typeof e === 'string' && e.startsWith(`Giveaway with message ID ${giveaway.messageID} has already ended.`)) {
        ctx.reply('This giveaway has already ended!')
      } else {
        this.client.emit('commandError', ctx, e)
      }
    })
  }

  async reroll (ctx, args) {
    if (!args[0]) {
      return ctx.reply(`${this.client.constants.error} You need to specify a valid message ID!`)
    }

    const giveaway = this.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || this.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0])

    if (!giveaway) {
      return ctx.reply(`${this.client.constants.error} Unable to find a giveaway with ID \`${args[0]}\``)
    }

    this.client.giveawaysManager.reroll(giveaway.messageID).then(() => {
      ctx.reply('Giveaway rerolled!')
    }).catch((e) => {
      if (typeof e === 'string' && e.startsWith(`Giveaway with message ID ${giveaway.messageID} has not ended.`)) {
        ctx.reply('This giveaway has not ended!')
      } else {
        this.client.emit('commandError', ctx, e)
      }
    })
  }
}

module.exports = Giveaway
