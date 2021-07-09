const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const c = require('@aero/centra')

class Urban extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/urban:description'),
      usage: language => language('commands/fun/urban:usage'),
      aliases: ['ud', 'urbandictionary'],
      botPermissions: ['EMBED_LINKS'],
      cooldown: 3
    })
  }

  async run(ctx, args) {
    const [query, page = 1] = args.join(' ').split(', ')

    if (isNaN(parseInt(page))) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/fun/urban:nan'))

    const index = page - 1
    if (index < 0) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/fun/urban:negative'))

    const { list } = await c(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`).json()

    const result = list[index]

    if (typeof result === 'undefined') return ctx.errorMsg(ctx.translate('common:error'), index === 0 ? ctx.translate('commands/fun/urban:noResult') : ctx.translate('commands/fun/urban:noPage'))

    const embeds = []

    for (const def of list) {
      const definition = this.content(ctx, def.definition, def.permalink)

      embeds.push(new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(ctx.translate('commands/fun/urban:word', this.client.utils.toProperCase(query)))
        .setURL(def.permalink)
        .setThumbnail('http://i.imgur.com/CcIZZsa.png')
        .addField(ctx.translate('commands/fun/urban:definition'), definition)
        .addField(ctx.translate('commands/fun/urban:example'), this.example(def.example))
        .addField(ctx.translate('commands/fun/urban:author'), def.author, true)
        .addField(ctx.translate('commands/fun/urban:likes'), `👍 ${def.thumbs_up}`, true)
        .addField(ctx.translate('commands/fun/urban:dislikes'), `👎 ${def.thumbs_down}`, true)
        .setFooter(`${ctx.translate('commands/fun/urban:index', { index: page, length: list.length })} • ${ctx.translate('commands/fun/urban:attribution')}`))
    }

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(parseInt(page))
      .setPageIndicator('footer', (page, pages) => `${ctx.translate('page', { page: page, pages: pages })} • ${ctx.translate('commands/fun/urban:attribution')}`)

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
    return `${this.cutText(definition, 750)}... [${ctx.translate('commands/fun/urban:continue')}](${permalink})`
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
