const Command = require('#structures/Command')

const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Jisho extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Search for a word on Jisho.org',
      usage: 'jisho <word>, [page]',
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to search for?')
    let [query, page = 1] = args.join(' ').split(', ')
    page = this.verifyInt(page, 1)

    const { data } = await c(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}`).json()

    if (!data || !data.length) return ctx.reply('No results found.')

    const res = data[page - 1]
    if (!res) return ctx.reply(`Invalid page! There are only ${data.length} pages.`)

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(`${this.client.utils.toProperCase(query)}`)
      .setURL(`https://jisho.org/search/${query}`)
      .addField('Japanese', res.japanese[0].word || res.japanese[0].reading, true)
      .addField('Reading', res.japanese[0].reading || res.japanese[0].word, true)
      .addField('English Meaning', `${this.client.utils.toProperCase(res.senses[0].english_definitions.join(', '))}`)
      .setFooter('Powered by Jisho.org', ctx.author.displayAvatarURL({ size: 32, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = Jisho
