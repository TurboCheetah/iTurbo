const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const ms = require('ms')

class Osu extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['osu!'],
      description: 'Retrieves osu! stats, recent, or top plays of a user',
      cooldown: 5,
      usage: 'osu <user | recent | top | setProfile> [user]',
      examples: {
        'user cookiezi': 'Retrieves the osu! profile info of the specified user',
        'top cookiezi': 'Retrieves the top osu! play of the specified user',
        'recent cookiezi': 'Retrieves the most recent osu! play of the specified user',
        'setProfile cookiezi': 'Links an osu! profile to your Discord account'
      },
      botPermissions: ['EMBED_LINKS']
    })

    this.ranks = {
      ssh: '<:GradeSSSilver:823406317850722314>',
      sshURL: 'https://cdn.discordapp.com/emojis/823406317850722314.png',
      ss: '<:GradeSS:823406393339281478>',
      ssURL: 'https://cdn.discordapp.com/emojis/823406393339281478.png',
      sh: '<:GradeSSilver:823406456383733781>',
      shURL: 'https://cdn.discordapp.com/emojis/823406456383733781.png',
      s: '<:GradeS:823406564136321034>',
      sURL: 'https://cdn.discordapp.com/emojis/823406564136321034.png',
      a: '<:GradeA:823406618376536064>',
      aURL: 'https://cdn.discordapp.com/emojis/823406618376536064.png'
    }
  }

  async run(ctx, [mode, user]) {
    if (!mode && !ctx.author.settings.osu) return ctx.reply(`Usage: \`${ctx.guild.prefix}osu <user | recent | top | setProfile> [user]\``)
    else if (!mode && ctx.author.settings.osu) mode = 'user'
    if (!user && !ctx.author.settings.osu) return ctx.reply(`${this.client.constants.emojis.error} You didn't specify a user nor do you have one linked to your Discord account!`)
    else if (!user && ctx.author.settings.osu) user = ctx.author.settings.osu

    switch (mode.toLowerCase()) {
      case 'user': {
        try {
          const osuUser = await this.client.osu.getUser({ u: user })
          const embed = new MessageEmbed()
            .setTitle(osuUser.name)
            .setThumbnail(`https://s.ppy.sh/a/${osuUser.id}`)
            .setURL(`https://osu.ppy.sh/users/${osuUser.id}`)
            .setColor(0x9590ee)
            .addField('Games', this.client.utils.formatNumber(osuUser.counts.plays), true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Accuracy', osuUser.accuracyFormatted, true)
            .addField('Level', osuUser.level.substring(0, 5), true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Playtime', ms(osuUser.secondsPlayed * 1000, { long: true }), true)
            .addField('Global 🌐', `${this.client.utils.formatNumber(osuUser.pp.rank)}`, true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField(`Country :flag_${osuUser.country.toLowerCase()}:`, `${this.client.utils.formatNumber(osuUser.pp.countryRank)}`, true)
            .addField('Scores', `${this.ranks.ssh}: ${this.client.utils.formatNumber(osuUser.counts.SSH)}\n${this.ranks.ss}: ${this.client.utils.formatNumber(osuUser.counts.SS)}\n${this.ranks.sh}: ${this.client.utils.formatNumber(osuUser.counts.SH)}\n${this.ranks.s}: ${this.client.utils.formatNumber(osuUser.counts.S)}\n${this.ranks.a}: ${this.client.utils.formatNumber(osuUser.counts.A)}\n`, true)
            .setFooter(`Started playing on ${osuUser.joinDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)
          ctx.reply({ embed })
        } catch (err) {
          throw err.message
        }
        break
      }
      case 'top': {
        try {
          const osuUser = await this.client.osu.getUser({ u: user })
          const [top] = await this.client.osu.getUserBest({ u: user })
          const embed = new MessageEmbed()
            .setAuthor(`${osuUser.name} | User Best`, `https://s.ppy.sh/a/${osuUser.id}`, `https://osu.ppy.sh/users/${osuUser.id}`)
            .setThumbnail(this.ranks[`${top.rank.toLowerCase()}URL`])
            .setImage(`https://assets.ppy.sh/beatmaps/${top.beatmap.beatmapSetId}/covers/cover.jpg`)
            .setColor(0x9590ee)
            .addField('Beatmap Info', `**Title**: [${top.beatmap.title}](https://osu.ppy.sh/b/${top.beatmap.id})\n**Author**: ${top.beatmap.creator}\n**Artist**: ${top.beatmap.artist}\n**Difficulty**: ${top.beatmap.version} | ${Math.round(top.beatmap.difficulty.rating * 100) / 100}\n**BPM**: ${top.beatmap.bpm}`, false)
            .addField('PP', Math.round(top.pp * 100) / 100, true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Combo', `${this.client.utils.formatNumber(top.maxCombo)}x/${this.client.utils.formatNumber(top.beatmap.maxCombo)}x`, true)
            .addField('Accuracy', `${Math.round(top.accuracy * 100 * 100) / 100}%`, true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Score', this.client.utils.formatNumber(top.score), true)
            .addField('Mods', top.mods.length ? top.mods : 'None', true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Hits', `Miss: \`${this.client.utils.formatNumber(top.counts.miss)}\`\n50: \`${this.client.utils.formatNumber(top.counts['50'])}\`\n100: \`${this.client.utils.formatNumber(top.counts['100'])}\`\n300: \`${this.client.utils.formatNumber(top.counts['300'])}\``, true)
            .setFooter(`Score placed on ${top.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)
          ctx.reply({ embed })
        } catch (err) {
          throw err.message
        }
        break
      }
      case 'recent': {
        try {
          const osuUser = await this.client.osu.getUser({ u: user })
          const [recent] = await this.client.osu.getUserRecent({ u: user })
          const embed = new MessageEmbed()
            .setAuthor(`${osuUser.name} | User Recent`, `https://s.ppy.sh/a/${osuUser.id}`, `https://osu.ppy.sh/users/${osuUser.id}`)
            .setThumbnail(this.ranks[`${recent.rank.toLowerCase()}URL`])
            .setImage(`https://assets.ppy.sh/beatmaps/${recent.beatmap.beatmapSetId}/covers/cover.jpg`)
            .setColor(0x9590ee)
            .addField('Beatmap Info', `**Title**: [${recent.beatmap.title}](https://osu.ppy.sh/b/${recent.beatmap.id})\n**Author**: ${recent.beatmap.creator}\n**Artist**: ${recent.beatmap.artist}\n**Difficulty**: ${recent.beatmap.version} | ${Math.round(recent.beatmap.difficulty.rating * 100) / 100}\n**BPM**: ${recent.beatmap.bpm}`, false)
            .addField('PP', Math.round(recent.pp * 100) / 100, true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Combo', `${this.client.utils.formatNumber(recent.maxCombo)}x/${this.client.utils.formatNumber(recent.beatmap.maxCombo)}x`, true)
            .addField('Accuracy', `${Math.round(recent.accuracy * 100 * 100) / 100}%`, true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Score', this.client.utils.formatNumber(recent.score), true)
            .addField('Mods', recent.mods.length ? recent.mods : 'None', true)
            .addField(this.client.constants.zws, this.client.constants.zws, true)
            .addField('Hits', `Miss: \`${this.client.utils.formatNumber(recent.counts.miss)}\`\n50: \`${this.client.utils.formatNumber(recent.counts['50'])}\`\n100: \`${this.client.utils.formatNumber(recent.counts['100'])}\`\n300: \`${this.client.utils.formatNumber(recent.counts['300'])}\``, true)
            .setFooter(`Score placed on ${recent.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)
          ctx.reply({ embed })
        } catch (err) {
          throw err.message
        }
        break
      }
      case 'setprofile': {
        try {
          ctx.author.update({ osu: user })
          ctx.reply(`${this.client.constants.emojis.success} Successfully linked your osu! profile to your Discord account`)
        } catch (err) {
          throw err.message
        }
        break
      }
      default:
        ctx.reply(`Usage: \`${ctx.guild.prefix}osu <user | recent | top | setProfile> [user]\``)
        break
    }
  }
}

module.exports = Osu
