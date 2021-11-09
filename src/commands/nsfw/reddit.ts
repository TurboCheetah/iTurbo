import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { client } from '../../index'
import { isNSFW, random } from '../../utils/utils'

@Discord()
export abstract class RedditCommand {
  @Slash('reddit', { description: 'Returns a reddit post for the specified category' })
  async reddit(
    @SlashChoice('Ass', 'ass')
    @SlashChoice('Boobs', 'boobs')
    @SlashChoice('Thighs', 'thighs')
    @SlashChoice('Gifs', 'gifs')
    @SlashOption('category', { description: 'What category would you like to search in?' })
    query: string,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<any> {
    if (isNSFW(interaction.channel as TextBasedChannels)) return await interaction.reply('The result I found was NSFW and I cannot post it in this channel.')

    let subreddits = []
    switch (query) {
      case 'ass':
        subreddits = ['ass', 'paag', 'asstastic', 'buttplug', 'whooties', 'AssholeBehindThong', 'Frogbutt', 'rearpussy', 'CuteLittleButts', 'HungryButts', 'reversecowgirl', 'facedownassup', 'butt', 'butts', 'pawg', 'bigasses', 'cosplaybutts', 'girlsinyogapants', 'BubbleButts', 'assinthong', 'smalltitsbigass', 'CelebrityButts', 'booty']
        break

      case 'boobs':
        subreddits = ['smallboobs', 'boobs', 'tits', 'tinytits', 'bigtitssmallnip', 'boobies', 'rosynips', 'tiddies']
        break

      case 'thighs':
        subreddits = ['girlsinyogapants', 'Thighs', 'thighhighs', 'ThickThighs', 'UnderwearGW', 'datgap', 'leggingsgonewild', 'pawg', 'hipcleavage', 'legs', 'pantyhose']
        break

      case 'gifs':
        subreddits = ['nsfw_gif', 'nsfw_gifs', 'porn_gifs', 'povjiggle', 'slowmojiggles', 'tittydrop', 'verticalgifs']
        break

      default:
        subreddits = ['girlsinyogapants', 'Thighs', 'thighhighs', 'ThickThighs', 'UnderwearGW', 'datgap', 'leggingsgonewild', 'pawg', 'hipcleavage', 'legs', 'pantyhose', 'ass', 'paag', 'asstastic', 'buttplug', 'whooties', 'AssholeBehindThong', 'Frogbutt', 'rearpussy', 'CuteLittleButts', 'HungryButts', 'reversecowgirl', 'facedownassup', 'butt', 'butts', 'pawg', 'bigasses', 'cosplaybutts', 'BubbleButts', 'assinthong', 'smalltitsbigass', 'booty', 'panties', 'FullBackPanties', 'PantiesToTheSide', 'thongs', 'xsmallgirls', 'PublicSexPorn', 'cameltoe', 'smallboobs', 'LegalTeens', 'TooCuteForPorn', 'adorableporn', 'AsiansGoneWild', 'trashyboners', 'StraightGirlsPlaying', 'LipsThatGrip', 'spreadeagle', 'dirtysmall', 'nsfw', 'pussy', 'gonewild', 'SexyTummies', 'SpreadEm', 'Ahegao_IRL', 'nsfwcosplay', 'RealGirls', 'lesbians', 'Fingering', 'AnalGW', 'anal', 'freeuse', 'BorednIgnored', 'grool', 'jilling', 'porn', 'Amateur', 'TinyTits', 'PetiteGoneWild', 'cumsluts', 'AsianHotties', 'simps', 'slimgirls', 'ginger', 'palegirls', 'BustyPetite', 'Innie', 'boobs', 'tits', 'bigtitssmallnip', 'assvsboobs', 'boobies', 'fantastictits', 'onoff', 'fortyfivefiftyfive', 'juicyasians', 'Nude_Selfie', 'nude_snapchat', 'rosynips', 'tiddies', 'justhotwomen', 'nsfwverifiedamateurs', 'public', 'slut', 'sluts', 'nsfw_gif', 'nsfw_gifs', 'porn_gifs', 'povjiggle', 'slowmojiggles', 'tittydrop', 'verticalgifs']
        break
    }

    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.reddit(random(subreddits), { removeNSFW: false, span: 'all' })

    const embed = new MessageEmbed().setTitle(`${res.post.subreddit} - ${res.post.title}`).setURL(res.url).setColor(0x9590ee).setImage(res.url).setDescription(`:thumbsup: ${res.post.upvotes} | :speech_balloon: ${res.post.comments}`).setFooter('Powered by Reddit')

    interaction.editReply({ embeds: [embed] })
  }
}