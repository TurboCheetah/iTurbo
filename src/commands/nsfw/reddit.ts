import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Guard, Slash, SlashChoice, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'
import { IsNsfw } from '#guards/IsNsfw'
import centra from '@aero/centra'

@Discord()
export abstract class RedditCommand {
    @Slash('reddit', { description: 'Returns a reddit post for the specified category' })
    @Guard(IsNsfw)
    async reddit(
        @SlashChoice({ name: 'Ass', value: 'ass' })
        @SlashChoice({ name: 'Boobs', value: 'boobs' })
        @SlashChoice({ name: 'Thighs', value: 'thighs' })
        @SlashChoice({ name: 'Gifs', value: 'gifs' })
        @SlashOption('category', { description: 'What category would you like to search in?' })
        query: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
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

        interface payload {
            url: string
            subreddit: string
            title: string
            source: string
            upvotes: string
            comments: string
            tries: number
        }

        const request = async (subreddit: string): Promise<payload> => {
            return new Promise(function (resolve, reject) {
                // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
                const extractPost = (body: any, tries: number): payload | void => {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    if (tries >= 25) return reject({ reason: 'Retry limit exceeded', message: 'Failed to find a suitable post', subreddit })
                    tries++
                    // grabs a random post
                    const post = client.utils.random(body).data
                    // checks if the post url ends with an image extension
                    switch (/(\.jpg|\.png|\.gif|\.jpeg)$/gi.test(post.url)) {
                        case true: {
                            // resolves the payload with all the juicy data
                            const payload = {
                                url: post.url,
                                subreddit: post.subreddit,
                                title: post.title,
                                source: post.permalink,
                                upvotes: post.ups,
                                comments: post.num_comments,
                                tries: tries
                            }
                            resolve(payload)
                            break
                        }
                        default:
                            // self explanatory (hopefully)
                            switch (post.is_video) {
                                case true:
                                    // tries to get another post if it's a video (this was used for discord and we can't embed videos)
                                    extractPost(body, tries)
                                    break
                                default:
                                    switch (post.media) {
                                        case null:
                                            // if media is null try again
                                            extractPost(body, tries)
                                            break
                                        default:
                                            // if the media thumbnail is from gfycat try again (thumbnails from gfycat are really low res)
                                            switch (post.url.includes('redgifs')) {
                                                case false: {
                                                    // resolve payload
                                                    const payload = {
                                                        url: post.url,
                                                        subreddit: post.subreddit,
                                                        title: post.title,
                                                        source: post.permalink,
                                                        upvotes: post.ups,
                                                        comments: post.num_comments,
                                                        tries: tries
                                                    }
                                                    resolve(payload)
                                                    break
                                                }
                                                // tries again
                                                default:
                                                    extractPost(body, tries)
                                            }
                                            break
                                    }
                                    break
                            }
                            break
                    }
                }
                // just some randomness
                const sortBy = ['best', 'top', 'hot']
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                const url = `https://www.reddit.com/r/${subreddit}/${client.utils.random(sortBy)}.json?limit=15`
                centra(url, 'GET')
                    .json()
                    .then(async response => {
                        try {
                            extractPost(response.data.children, 0)
                        } catch (error) {
                            reject(error)
                        }
                    })
                    .catch(error => {
                        // if the request fails reject
                        reject(error)
                    })
            })
        }

        await interaction.deferReply({ ephemeral: !ephemeral })
        const post = await request(client.utils.random(subreddits))
        const embed = new MessageEmbed().setTitle(`${post.subreddit} - ${post.title}`).setURL(`https://reddit.com${post.source}`).setColor(0x9590ee).setImage(post.url).setDescription(`:thumbsup: ${post.upvotes} | :speech_balloon: ${post.comments}`).setFooter({ text: 'Powered by Reddit' })

        interaction.editReply({ embeds: [embed] })
    }
}
