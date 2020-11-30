const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const ms = require('ms')

class Giveaway extends Command {
  constructor (...args) {
    super(...args, {
      aliases: ['catfact', 'kittenfact'],
      cooldown: 3,
      description: 'Let me tell you a misterious cat fact.',
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
      return ctx.reply(`${this.client.constants.error} No channel specified. Please mention a valid channel.`)
    }

    const duration = args[1]

    if (!duration || isNaN(ms(duration))) {
      return ctx.reply(`${this.client.constants.error} Invalid duraiton specified. Please specify a valid duration, e.g 24h.`)
    }

    const winners = args[2]

    if (!winners || isNaN(winners) || (parseInt(giveawayNumberWinners) <= 0)) {
      return ctx.reply(`${this.client.constants.error} Invalid winner count. Please specify a valid amount of giveaway winners.`)
    }

    const prize = args[3]

    if (!prize) {
      return ctx.reply(`${this.client.constants.error} No prize specified! Please specify a valid prize.`)
    }

    this.client.giveawaysManager.start(giveawayChannel, {
      time: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: giveawayNumberWinners,
      hostedBy: client.config.hostedBy ? message.author : null,
      messages: {
        giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
        giveawayEnded: '🎉🎉 **GIVEAWAY ENDED** 🎉🎉',
        timeRemaining: 'Time remaining: **{duration}**!',
        inviteToParticipate: 'React with 🎉 to participate!',
        winMessage: 'Congratulations, {winners}! You won **{prize}**!',
        embedFooter: 'Giveaways',
        noWinner: 'Giveaway cancelled, no valid participations.',
        hostedBy: 'Hosted by: {user}',
        winners: 'winner(s)',
        endedAt: 'Ended at',
        units: {
          seconds: 'seconds',
          minutes: 'minutes',
          hours: 'hours',
          days: 'days',
          pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
        }
      }
    })
  }
}

module.exports = Giveaway
