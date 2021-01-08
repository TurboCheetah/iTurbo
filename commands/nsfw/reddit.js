const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Reddit extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Returns a reddit post for the specified category. If no category is given, a post will be returned from any of the possible categories.',
      usage: 'reddit',
      extendedHelp: 'reddit [ass|boobs|thighs]',
      aliases: ['porn', 'nsfwr', 'rnsfw'],
      cooldown: 3,
      cost: 3,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })

    this.errorMessage = 'There was an error. Reddit may be down, or the subreddit doesnt exist.'
  }

  async run(ctx, [args]) {
    const client = this.client
    let subreddits = []
    switch (args) {
      case 'ass':
        subreddits = ['ass', 'paag', 'asstastic', 'buttplug', 'whooties', 'AssholeBehindThong', 'Frogbutt', 'rearpussy', 'CuteLittleButts', 'HungryButts', 'reversecowgirl', 'facedownassup', 'butt', 'butts', 'pawg', 'bigasses', 'cosplaybutts', 'girlsinyogapants', 'BubbleButts', 'assinthong', 'smalltitsbigass', 'CelebrityButts', 'booty']
        break

      case 'boobs':
        subreddits = ['smallboobs', 'boobs', 'tits', 'tinytits', 'bigtitssmallnip', 'boobies', 'rosynips', 'tiddies']
        break

      case 'thighs':
        subreddits = ['girlsinyogapants', 'Thighs', 'thighhighs', 'ThickThighs', 'UnderwearGW', 'datgap', 'leggingsgonewild', 'pawg', 'hipcleavage', 'legs', 'pantyhose']
        break

      default:
        subreddits = ['girlsinyogapants', 'Thighs', 'thighhighs', 'ThickThighs', 'UnderwearGW', 'datgap', 'leggingsgonewild', 'pawg', 'hipcleavage', 'legs', 'pantyhose', 'ass', 'paag', 'asstastic', 'buttplug', 'whooties', 'AssholeBehindThong', 'Frogbutt', 'rearpussy', 'CuteLittleButts', 'HungryButts', 'reversecowgirl', 'facedownassup', 'butt', 'butts', 'pawg', 'bigasses', 'cosplaybutts', 'BubbleButts', 'assinthong', 'smalltitsbigass', 'booty', 'panties', 'FullBackPanties', 'PantiesToTheSide', 'thongs', 'xsmallgirls', 'PublicSexPorn', 'cameltoe', 'smallboobs', 'LegalTeens', 'TooCuteForPorn', 'adorableporn', 'AsiansGoneWild', 'trashyboners', 'StraightGirlsPlaying', 'LipsThatGrip', 'spreadeagle', 'dirtysmall', 'nsfw', 'pussy', 'gonewild', 'SexyTummies', 'SpreadEm', 'Ahegao_IRL', 'nsfwcosplay', 'RealGirls', 'lesbians', 'Fingering', 'AnalGW', 'anal', 'freeuse', 'BorednIgnored', 'grool', 'jilling', 'porn', 'Amateur', 'TinyTits', 'PetiteGoneWild', 'cumsluts', 'AsianHotties', 'simps', 'slimgirls', 'ginger', 'palegirls', 'BustyPetite', 'Innie', 'boobs', 'tits', 'bigtitssmallnip', 'assvsboobs', 'boobies', 'fantastictits', 'onoff', 'fortyfivefiftyfive', 'juicyasians', 'Nude_Selfie', 'nude_snapchat', 'rosynips', 'tiddies', 'justhotwomen', 'nsfwverifiedamateurs', 'public', 'slut', 'sluts']
        break
    }

    const site = client.utils.random(subreddits)
    function request(site) {
      return new Promise(function (resolve, reject) {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (!site) reject({ reason: 'No subreddit supplied', message: "Couldn't make request because there wasn't a subreddit" })
        function ExtractRedditUrl(body, tries) {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (tries >= 25) return reject({ reason: 'Retry limit exceeded', message: 'Failed to find a suitable post', subbredit: site })
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
                  ExtractRedditUrl(body, tries)
                  break
                default:
                  switch (post.media) {
                    case null:
                      // if media is null try again
                      ExtractRedditUrl(body, tries)
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
                          ExtractRedditUrl(body, tries)
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
        const url = `https://www.reddit.com/r/${site}/${client.utils.random(sortBy)}.json?limit=15`
        c(url)
          .json()
          .then(async response => {
            try {
              ExtractRedditUrl(response.data.children, 0)
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

    const getPorn = () => {
      return request(site)
    }

    getPorn()
      .then(r => {
        const embed = new MessageEmbed()
          .setTitle(`r/${r.subreddit} - ${r.title}`)
          .setURL(`https://reddit.com${r.source}`)
          .setColor(0x9590ee)
          .setImage(r.url)
          .setDescription(`:thumbsup: ${r.upvotes} | :speech_balloon: ${r.comments}`)
          .setFooter(`Requested by: ${ctx.author.tag} • Powered by Reddit`, ctx.author.displayAvatarURL({ size: 32 }))

        return ctx.reply({ embed })
      })
      .catch(err => {
        console.error(err)
        ctx.reply(`Error: ${typeof err === 'object' ? (err = `Reason: ${err.reason}. ${err.message}.`) : err}`)
      })
  }
}

module.exports = Reddit
