const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const c = require('@aero/centra')

class Urban extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('urbanDescription'),
      usage: language => language.get('urbanUsage'),
      aliases: ['ud', 'urbandictionary'],
      botPermissions: ['EMBED_LINKS'],
      cooldown: 3
    })
  }

  async run(ctx, args) {
    const [query, page = 1] = args.join(' ').split(', ')

    if (isNaN(parseInt(page))) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('urbanNaN'))

    const index = page - 1
    if (index < 0) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('urbanNegative'))

    const { list } = await c(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`).json()

    const result = list[index]

    if (typeof result === 'undefined') return ctx.errorMsg(ctx.language.get('error'), index === 0 ? ctx.language.get('urbanNoResult') : ctx.language.get('urbanNoPage'))

    const embeds = []

    for (const def of list) {
      const definition = this.content(ctx, def.definition, def.permalink)

      embeds.push(new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(ctx.language.get('urbanWord', this.client.utils.toProperCase(query)))
        .setURL(def.permalink)
        .setThumbnail('http://i.imgur.com/CcIZZsa.png')
        .addField(ctx.language.get('urbanDefinition'), definition)
        .addField(ctx.language.get('urbanExample'), this.example(def.example))
        .addField(ctx.language.get('urbanAuthor'), def.author, true)
        .addField(ctx.language.get('urbanLikes'), `👍 ${def.thumbs_up}`, true)
        .addField(ctx.language.get('urbanDislikes'), `👎 ${def.thumbs_down}`, true)
        .setFooter(`${ctx.language.get('urbanIndex', page, list.length)} • ${ctx.language.get('urbanAttribution')}`))
    }

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(parseInt(page))
      .setPageIndicator('footer', (page, pages) => `${ctx.language.get('page', page, pages)} • ${ctx.language.get('urbanAttribution')}`)

    return Pagination.build()
  }

  example(example) {
    const format = this.format(example)
    if (format.length < 750) return format
    if (example.length < 750) return example
    return this.cutText(example, 750)
  }

  content(ctx, definition, permalink) {
    const format = this.format(definition)
    if (format.length < 750) return format
    if (definition.length < 750) return definition
    return `${this.cutText(definition, 750)}... [${ctx.language.get('urbanContinue')}](${permalink})`
  }

  cutText(str, length) {
    if (str.length < length) return str
    const cut = this.splitText(str, length - 3)
    if (cut.length < length - 3) return `${cut}...`
    return `${cut.slice(0, length - 3)}...`
  }

  splitText(str, length, char = ' ') {
    const x = str.substring(0, length).lastIndexOf(char)
    const pos = x === -1 ? length : x
    return str.substring(0, pos)
  }

  format(str) {
    // https://stackoverflow.com/questions/52374809/javascript-regular-expression-to-catch-boxes
    return str.replace(/\[([^\][]+)\]/g, (x, y) => `${x}(https://www.urbandictionary.com/define.php?term=${y.replace(/\s+/g, '+')})`)
  }
}

module.exports = Urban
