const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { MessageEmbed } = require('discord.js')

class Weed extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Search for a strain on Leafly',
      usage: 'weed <strain|type|feeling|wellness|popular|trending|underrated>',
      extendedHelp: 'Search for info about a strain, best strains in certain categories, popular strains, trending strains, and more!',
      cooldown: 15,
      aliases: ['strain', 'cannabis', 'marijuana', 'leafly']
    })
  }

  async run (ctx, args) {
    const [filter] = args.join(' ').split(' ')
    if (!filter) return ctx.reply(`Please provide a search query. Refer to \`${ctx.guild ? ctx.guild.settings.prefix : '|'}help weed\` for a list of all possible queries.`)
    switch (filter) {
      default:
        ctx.reply(`Please provide a valid search query. Refer to \`${ctx.guild ? ctx.guild.settings.prefix : '|'}help weed\` for a list of all possible queries.`)
        break
      case 'strain':
        var args = args.splice(1)
        if (!args.length) return ctx.reply('What am I supposed to search for? Please provide a strain!')
        var $ = await fetch(`https://www.leafly.com/strains/${args.join('-').toLowerCase()}`)
          .then((res) => {
            if (!res.ok) throw 'Something went wrong.'
            return res.text()
          })
          .then((html) => cheerio.load(html))

        var terpines = []

        const results = {
          name: $('.text-hero').text(),
          image: $('.slide').next().find('img').attr('src'),
          type: $('h2.font-mono.font-bold.text-green.text-xs').find('a').text(),
          thc: $('button.flex.font-mono.font-bold.flex-row.items-center.ml-md').find('div').text(),
          terpines: $('div.flex.flex-row.flex-grow.mt-xs').find('div.font-normal').each(function (i, elem) { terpines[i] = $(this).text() }),
          description: $('.strain__description').find('p').text(),
          effects: $('div.react-tabs__tab-panel.react-tabs__tab-panel--selected').find('div.mb-xl.relative.w-full').find('div.font-bold.font-headers.text-sm').text().split('%').join('%\n').slice(0, -1),
          helpsWith: $('div.react-tabs__tab-panel').next().find('div.mb-xl.relative.w-full').find('div.font-bold.font-headers.text-sm').text().split('%').join('%\n').slice(0, -1).split(/\r?\n/, 5),
          negatives: $('div.react-tabs__tab-panel').next().next().find('div.mb-xl.relative.w-full').find('div.font-bold.font-headers.text-sm').text().split('%').join('%\n').slice(0, -1),
          reviews: $('h2.pl-sm.self-end.text-green.text-sm').text()
        }

        if (!results.name) {
          try {
            var $ = await fetch(`https://www.leafly.com/search?q=${args.join('+')}`)
              .then((res) => {
                if (!res.ok) throw 'Something went wrong.'
                return res.text()
              })
              .then((html) => cheerio.load(html))
            return ctx.reply(`Did you mean **${$('div.jsx-3613316329.flex-grow').find('div').first().text()}**${$('div.jsx-3613316329.flex-grow').find('div').next().text().startsWith('aka') ? ' ' + $('div.text-xs.font-bold.text-green').first().text() + '?' : '?'} Try searching for **${$('div.jsx-3613316329.result-item__container').find('a').attr('href').slice(31).split('-').join(' ')}** instead.`)
          } catch {
            return ctx.reply('No Results Found.')
          }
        }
        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle(results.name)
          .setURL(`https://www.leafly.com/strains/${args.join('-')}`)
          .setThumbnail(results.image ? results.image.replace(/ /g, '%20') : 'https://public.leafly.com/favicon/apple-touch-icon.png')
          .addField('Type', results.type ? results.type : 'Undefined', true)
          .addField('THC', results.thc ? results.thc : 'Undefined', true)
          .addField('Terpines', terpines.length > 0 ? terpines.join(', ') : 'None listed', true)
          .addField('Strain Description', results.description ? this.client.utils.shorten(results.description) : 'Undefined')
          .addField('Effects', results.effects ? results.effects : 'Undefined', true)
          .addField('Helps with', results.helpsWith ? results.helpsWith : 'Undefined', true)
          .addField('Negative effects', results.negatives ? results.negatives : 'Undefined', true)
          .addField('Reviews', results.reviews ? `Read ${results.reviews} reviews [here](https://www.leafly.com/strains/${args.join('-')}/reviews).` : 'No reviews have been left for this strain.', true)
          .setFooter(`Requested by: ${ctx.author.tag} • Powered by Leafly`, ctx.author.displayAvatarURL({ size: 32 }))

        ctx.reply({ embed })
        break
      case 'type':
        var args = args.splice(1)
        var valid = ['indica', 'sativa', 'hybrid']
        if (!args.length) return ctx.reply('Invalid search query! Valid queries are: indica, sativa, and hybrid.')
        if (!valid.includes(args[0])) return ctx.reply('Invalid search query! Valid queries are: indica, sativa, and hybrid.')
        var $ = await fetch(`https://www.leafly.com/strains/lists/category/${args[0]}`)
          .then((res) => {
            if (!res.ok) throw 'Something went wrong.'
            return res.text()
          })
          .then((html) => cheerio.load(html))
        var strains = []
        $('.strain-tile__name').each(function (i, elem) {
          strains[i] = $(this).text()
        })
        var effects = []
        $('span.tag.mb-md').each(function (i, elem) {
          effects[i] = $(this).text()
        })
        var strainURL = []
        $('a.strain-tile.justify-start.relative').each(function (i, elem) {
          strainURL[i] = $(this).attr('href')
        })

        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle(`Top 10 ${args[0]} strains`)
          .setURL(`https://www.leafly.com/strains/lists/category/${args[0]}`)
          .setFooter(`Requested by: ${ctx.author.tag} | To get more info on a strain, run ${ctx.guild ? ctx.guild.settings.prefix : '|'}weed strain <query> • Powered by Leafly`, ctx.author.displayAvatarURL({ size: 32 }))

        var i
        for (i = 0; i < 10; i++) {
          embed.addField(strains[i], `${effects[i]} - View more info about this strain [here](https://www.leafly.com${strainURL[i]})`, true)
        }

        ctx.reply({ embed })

        break
      case 'feeling':
        var args = args.splice(1)
        var valid = ['euphoric', 'relaxed', 'aroused', 'focused', 'energetic', 'sleepy', 'giggly', 'happy', 'talkative', 'tingly', 'uplifted', 'creative', 'hungry']
        if (!args.length) return ctx.reply(`Invalid search query! Valid queries are: ${valid.splice(0, 12).join(', ')}, and ${valid[0]}.`)
        if (!valid.includes(args[0])) return ctx.reply(`Invalid search query! Valid queries are: ${valid.splice(0, 12).join(', ')}, and ${valid[0]}.`)
        var $ = await fetch(`https://www.leafly.com/strains/lists/effect/${args[0]}?sort=popular`)
          .then((res) => {
            if (!res.ok) throw 'Something went wrong.'
            return res.text()
          })
          .then((html) => cheerio.load(html))
        var strains = []
        $('.strain-tile__name').each(function (i, elem) {
          strains[i] = $(this).text()
        })
        var effects = []
        $('span.tag.mb-md').each(function (i, elem) {
          effects[i] = $(this).text()
        })
        var strainURL = []
        $('a.strain-tile.justify-start.relative').each(function (i, elem) {
          strainURL[i] = $(this).attr('href')
        })

        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle(`Top 10 ${args[0]} strains`)
          .setURL(`https://www.leafly.com/strains/lists/effect/${args[0]}?sort=popular`)
          .setFooter(`Requested by: ${ctx.author.tag} | To get more info on a strain, run ${ctx.guild ? ctx.guild.settings.prefix : '|'}weed strain <query> • Powered by Leafly`, ctx.author.displayAvatarURL({ size: 32 }))

        var i
        for (i = 0; i < 10; i++) {
          embed.addField(strains[i], `${effects[i]} - View more info about this strain [here](https://www.leafly.com${strainURL[i]})`, true)
        }

        ctx.reply({ embed })

        break
      case 'wellness':
        var args = args.splice(1)
        var valid = ['depression', 'insomnia', 'nausea', 'inflammation', 'anxiety', 'pain']
        if (!args.length) return ctx.reply('Invalid search query! Valid queries are: depression, insomnia,  nausea, inflammation, anxiety, and pain.')
        if (!valid.includes(args[0])) return ctx.reply('Invalid search query! Valid queries are: depression, insomnia,  nausea, inflammation, anxiety, and pain.')
        var $ = await fetch(`https://www.leafly.com/strains/lists/condition/${args[0]}?sort=popular`)
          .then((res) => {
            if (!res.ok) throw 'Something went wrong.'
            return res.text()
          })
          .then((html) => cheerio.load(html))
        var strains = []
        $('.strain-tile__name').each(function (i, elem) {
          strains[i] = $(this).text()
        })
        var effects = []
        $('span.tag.mb-md').each(function (i, elem) {
          effects[i] = $(this).text()
        })
        var strainURL = []
        $('a.strain-tile.justify-start.relative').each(function (i, elem) {
          strainURL[i] = $(this).attr('href')
        })

        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle(`Top 10 strains for ${args[0]} `)
          .setURL(`https://www.leafly.com/strains/lists/condition/${args[0]}?sort=popular`)
          .setFooter(`Requested by: ${ctx.author.tag} | To get more info on a strain, run ${ctx.guild ? ctx.guild.settings.prefix : '|'}weed strain <query> • Powered by Leafly`, ctx.author.displayAvatarURL({ size: 32 }))

        var i
        for (i = 0; i < 10; i++) {
          embed.addField(strains[i], `${effects[i]} - View more info about this strain [here](https://www.leafly.com${strainURL[i]})`, true)
        }

        ctx.reply({ embed })

        break
      case 'popular':
        var $ = await fetch('https://www.leafly.com/strains/lists/curated/popular-marijuana-strains')
          .then((res) => {
            if (!res.ok) throw 'Something went wrong.'
            return res.text()
          })
          .then((html) => cheerio.load(html))
        var strains = []
        $('.strain-tile__name').each(function (i, elem) {
          strains[i] = $(this).text()
        })
        var effects = []
        $('span.tag.mb-md').each(function (i, elem) {
          effects[i] = $(this).text()
        })
        var strainURL = []
        $('a.strain-tile.justify-start.relative').each(function (i, elem) {
          strainURL[i] = $(this).attr('href')
        })

        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle('Most popular strains')
          .setURL('https://www.leafly.com/strains/lists/curated/popular-marijuana-strains')
          .setFooter(`Requested by: ${ctx.author.tag} | To get more info on a strain, run ${ctx.guild ? ctx.guild.settings.prefix : '|'}weed strain <query> • Powered by Leafly`, ctx.author.displayAvatarURL({ size: 32 }))

        var i
        for (i = 0; i < strains.length; i++) {
          embed.addField(strains[i], `${effects[i]} - View more info about this strain [here](https://www.leafly.com${strainURL[i]})`, true)
        }

        ctx.reply({ embed })

        break
      case 'trending':
        var $ = await fetch('https://www.leafly.com/strains/lists/curated/trending-marijuana-strains')
          .then((res) => {
            if (!res.ok) throw 'Something went wrong.'
            return res.text()
          })
          .then((html) => cheerio.load(html))
        var strains = []
        $('.strain-tile__name').each(function (i, elem) {
          strains[i] = $(this).text()
        })
        var effects = []
        $('span.tag.mb-md').each(function (i, elem) {
          effects[i] = $(this).text()
        })
        var strainURL = []
        $('a.strain-tile.justify-start.relative').each(function (i, elem) {
          strainURL[i] = $(this).attr('href')
        })

        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle('Trending strains')
          .setURL('https://www.leafly.com/strains/lists/curated/trending-marijuana-strains')
          .setFooter(`Requested by: ${ctx.author.tag} | To get more info on a strain, run ${ctx.guild ? ctx.guild.settings.prefix : '|'}weed strain <query> • Powered by Leafly`, ctx.author.displayAvatarURL({ size: 32 }))

        var i
        for (i = 0; i < strains.length; i++) {
          embed.addField(strains[i], `${effects[i]} - View more info about this strain [here](https://www.leafly.com${strainURL[i]})`, true)
        }

        ctx.reply({ embed })

        break
      case 'underrated':
        var $ = await fetch('https://www.leafly.com/strains/lists/curated/underrated-thc-strains')
          .then((res) => {
            if (!res.ok) throw 'Something went wrong.'
            return res.text()
          })
          .then((html) => cheerio.load(html))
        var strains = []
        $('.strain-tile__name').each(function (i, elem) {
          strains[i] = $(this).text()
        })
        var effects = []
        $('span.tag.mb-md').each(function (i, elem) {
          effects[i] = $(this).text()
        })
        var strainURL = []
        $('a.strain-tile.justify-start.relative').each(function (i, elem) {
          strainURL[i] = $(this).attr('href')
        })

        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setTitle('Underrated strains')
          .setURL('https://www.leafly.com/strains/lists/curated/underrated-thc-strains')
          .setFooter(`Requested by: ${ctx.author.tag} | To get more info on a strain, run ${ctx.guild ? ctx.guild.settings.prefix : '|'}weed strain <query> • Powered by Leafly`, ctx.author.displayAvatarURL({ size: 32 }))

        var i
        for (i = 0; i < strains.length; i++) {
          embed.addField(strains[i], `${effects[i]} - View more info about this strain [here](https://www.leafly.com${strainURL[i]})`, true)
        }

        ctx.reply({ embed })

        break
    }
  }
}

module.exports = Weed
