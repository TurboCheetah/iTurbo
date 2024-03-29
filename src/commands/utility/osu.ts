import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import ms from 'ms'
import { IslaClient } from '#/Client'

@Discord()
export abstract class OsuCommand {
    @Slash('osu', { description: 'Retrieves osu! stats, recent, or top plays of a user' })
    async copy(
        @SlashChoice({ name: 'User', value: 'user' })
        @SlashChoice({ name: 'Recent', value: 'recent' })
        @SlashChoice({ name: 'Top', value: 'top' })
        @SlashOption('type', { description: "Type of search you'd like to perform" })
        type: string,
        @SlashOption('user', { description: "The use whose stats you'd like to retrieve" })
        user: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
        const ranks = {
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

        await interaction.deferReply({ ephemeral: !ephemeral })

        switch (type) {
            case 'user': {
                try {
                    const osuUser = await client.osu.getUser({ u: user })
                    const embed = new MessageEmbed()
                        .setTitle(osuUser.name)
                        .setThumbnail(`https://s.ppy.sh/a/${osuUser.id}`)
                        .setURL(`https://osu.ppy.sh/users/${osuUser.id}`)
                        .setColor(0x9590ee)
                        .addField('Games', client.utils.formatNumber(osuUser.counts.plays), true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField('Accuracy', osuUser.accuracyFormatted, true)
                        .addField('Level', osuUser.level.toString().substring(0, 5), true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField('Playtime', ms(osuUser.secondsPlayed * 1000, { long: true }), true)
                        .addField('Global 🌐', `${client.utils.formatNumber(+osuUser.pp.rank)}`, true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField(`Country :flag_${osuUser.country.toLowerCase()}:`, `${client.utils.formatNumber(+osuUser.pp.countryRank)}`, true)
                        .addField('Scores', `${ranks.ssh}: ${client.utils.formatNumber(osuUser.counts.SSH)}\n${ranks.ss}: ${client.utils.formatNumber(osuUser.counts.SS)}\n${ranks.sh}: ${client.utils.formatNumber(osuUser.counts.SH)}\n${ranks.s}: ${client.utils.formatNumber(osuUser.counts.S)}\n${ranks.a}: ${client.utils.formatNumber(osuUser.counts.A)}\n`, true)
                        .setFooter({ text: `Started playing on ${(osuUser.joinDate as Date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` })
                    interaction.editReply({ embeds: [embed] })
                } catch (err) {
                    interaction.editReply(`Error: \`${err as string}\``)
                }
                break
            }
            case 'top': {
                try {
                    const osuUser = await client.osu.getUser({ u: user })
                    const [top] = await client.osu.getUserBest({ u: user })

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${osuUser.name} | User Best`, iconURL: `https://s.ppy.sh/a/${osuUser.id}`, url: `https://osu.ppy.sh/users/${osuUser.id}` })
                        .setThumbnail(ranks[`${top.rank.toLowerCase()}URL` as keyof typeof ranks])
                        .setImage(`https://assets.ppy.sh/beatmaps/${top.beatmap.beatmapSetId}/covers/cover.jpg`)
                        .setColor(0x9590ee)
                        .addField('Beatmap Info', `**Title**: [${top.beatmap.title}](https://osu.ppy.sh/b/${top.beatmap.id})\n**Author**: ${top.beatmap.creator}\n**Artist**: ${top.beatmap.artist}\n**Difficulty**: ${top.beatmap.version} | ${Math.round(top.beatmap.difficulty.rating * 100) / 100}\n**BPM**: ${top.beatmap.bpm}`, false)
                        .addField('PP', `${Math.round(top.pp * 100) / 100}`, true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField('Combo', `${client.utils.formatNumber(top.maxCombo)}x/${client.utils.formatNumber(top.beatmap.maxCombo)}x`, true)
                        .addField('Accuracy', `${Math.round((top.accuracy as number) * 100 * 100) / 100}%`, true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField('Score', client.utils.formatNumber(top.score), true)
                        .addField('Hits', `Miss: **${client.utils.formatNumber(top.counts.miss)}**, 50: **${client.utils.formatNumber(top.counts['50'])}**, 100: **${client.utils.formatNumber(top.counts['100'])}**, 300: **${client.utils.formatNumber(top.counts['300'])}**`, false)
                        .addField('Mods', top.mods.length ? (top.mods as string[]).join(', ') : 'None', false)
                        .setFooter({ text: `Score placed on ${(top.date as Date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` })
                    interaction.editReply({ embeds: [embed] })
                } catch (err) {
                    interaction.editReply(`Error: \`${err as string}\``)
                }
                break
            }
            case 'recent': {
                try {
                    const osuUser = await client.osu.getUser({ u: user })
                    const [recent] = await client.osu.getUserRecent({ u: user })
                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${osuUser.name} | User Recent`, iconURL: `https://s.ppy.sh/a/${osuUser.id}`, url: `https://osu.ppy.sh/users/${osuUser.id}` })
                        .setThumbnail(ranks[`${recent.rank.toLowerCase()}URL` as keyof typeof ranks])
                        .setImage(`https://assets.ppy.sh/beatmaps/${recent.beatmap.beatmapSetId}/covers/cover.jpg`)
                        .setColor(0x9590ee)
                        .addField('Beatmap Info', `**Title**: [${recent.beatmap.title}](https://osu.ppy.sh/b/${recent.beatmap.id})\n**Author**: ${recent.beatmap.creator}\n**Artist**: ${recent.beatmap.artist}\n**Difficulty**: ${recent.beatmap.version} | ${Math.round(recent.beatmap.difficulty.rating * 100) / 100}\n**BPM**: ${recent.beatmap.bpm}`, false)
                        .addField('PP', `${Math.round(recent.pp * 100) / 100}`, true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField('Combo', `${client.utils.formatNumber(recent.maxCombo)}x/${client.utils.formatNumber(recent.beatmap.maxCombo)}x`, true)
                        .addField('Accuracy', `${Math.round((recent.accuracy as number) * 100 * 100) / 100}%`, true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField('Score', client.utils.formatNumber(recent.score), true)
                        .addField('Mods', recent.mods.length ? (recent.mods as string[]).join(', ') : 'None', true)
                        .addField(client.constants.zws, client.constants.zws, true)
                        .addField('Hits', `Miss: **${client.utils.formatNumber(recent.counts.miss)}**\n50: **${client.utils.formatNumber(recent.counts['50'])}**\n100: **${client.utils.formatNumber(recent.counts['100'])}**\n300: **${client.utils.formatNumber(recent.counts['300'])}**`, true)
                        .setFooter({ text: `Score placed on ${(recent.date as Date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` })
                    interaction.editReply({ embeds: [embed] })
                } catch (err) {
                    interaction.editReply(`Error: \`${err as string}\``)
                }
                break
            }
        }
    }
}
