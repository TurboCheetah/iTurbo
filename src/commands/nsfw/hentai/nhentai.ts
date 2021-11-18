import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { Pagination } from '@discordx/utilities'
import { IslaClient } from '../../../Client'
import { isNSFW } from '../../../utils/utils'
import { Doujin } from 'nhentai'

@Discord()
@SlashGroup('nhentai', 'Read doujin from nHentai')
export abstract class NHentaiCommands {
  @Slash('doujin', { description: 'Read doujin from nHentai' })
  async doujin(
    @SlashOption('id', { description: "The name of the ID of the doujin you'd like to read", required: true })
    id: number,
    @SlashOption('page', { description: "The page you'd like to view", required: false })
    page: number,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<any> {
    if (!isNSFW(interaction.channel as TextBasedChannels) && ephemeral) return interaction.reply({ content: 'Please re-run this command with private mode enabled or in an NSFW channel!', ephemeral: true })

    await interaction.deferReply({ ephemeral: !ephemeral })

    const doujin = await client.nhentai.fetchDoujin(id)

    if (doujin === null) return interaction.editReply({ embeds: [new MessageEmbed().setColor(0xee9090).setTitle('Doujin not found').setDescription('Please try another ID.')] })

    const embeds = this.embedBuilder(doujin)

    const pagination = new Pagination(interaction, embeds, { type: 'BUTTON', initialPage: page })
    await pagination.send()
  }

  @Slash('random', { description: 'Read a random doujin from nHentai' })
  async random(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    if (!isNSFW(interaction.channel as TextBasedChannels) && ephemeral) return interaction.reply({ content: 'Please re-run this command with private mode enabled or in an NSFW channel!', ephemeral: true })

    await interaction.deferReply({ ephemeral: !ephemeral })

    const doujin = await client.nhentai.randomDoujin()
    const embeds = this.embedBuilder(doujin)

    const pagination = new Pagination(interaction, embeds, { type: 'BUTTON' })
    await pagination.send()
  }

  embedBuilder(doujin: Doujin): MessageEmbed[] {
    const coverEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(doujin.titles.pretty.length > 0 ? doujin.titles.pretty : doujin.titles.english.length > 0 ? doujin.titles.english : doujin.titles.japanese)
      .setURL(doujin.url)
      .setImage(doujin.cover.url)
      .addField('Favorites', `${doujin.favorites}`, true)
      .addField('Length', `${doujin.length}`, true)
      .addField('Tags', `${doujin.tags.all.map(tag => tag.name).join(', ')}`)
      .setFooter(`${doujin.id}`)

    const pages = doujin.pages.map((p, i) => {
      return new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle(doujin.titles.pretty.length > 0 ? doujin.titles.pretty : doujin.titles.english.length > 0 ? doujin.titles.english : doujin.titles.japanese)
        .setURL(doujin.url)
        .setImage(p.url)
        .setFooter(`${doujin.id} | Page ${i + 1} of ${doujin.pages.length}`)
    })

    return [coverEmbed, ...pages]
  }
}
