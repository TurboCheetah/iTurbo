const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds, FieldsEmbed } = require('discord-paginationembed')

class Help extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/general/help:description'),
      usage: language => language('commands/general/help:usage'),
      botPermissions: ['EMBED_LINKS', 'ADD_REACTIONS']
    })
  }

  async run(ctx, [command, page = 1]) {
    const map = {} // Map<Category, Array<Command.Name>>
    for (const command of this.store.values()) {
      // Check for hidden commands first so if all commands in a category is hidden we won't even show the category.
      if (command.hidden) continue
      if (command.ownerOnly && ctx.author.id !== this.client.constants.ownerID) continue
      if (command.nsfw && !ctx.channel.nsfw) continue

      if (!map[command.category]) map[command.category] = []
      map[command.category].push(command.name)
    }

    // Sort the categories alphabetically.
    const keys = Object.keys(map).sort()

    if (command) {
      if (keys.includes(this.client.utils.toProperCase(command))) {
        const category = this.client.utils.toProperCase(command)

        const Pagination = new FieldsEmbed()
          .setArray(map[category])
          .setAuthorizedUsers([ctx.author.id])
          .setChannel(ctx.channel)
          .setElementsPerPage(7)
          .setPage(page)
          .setPageIndicator('footer', (page, pages) => ctx.translate('page', { page: page, pages: pages }))
          .formatField(ctx.translate('commands/general/help:commands'), i => `• [**${i}**](https://docs.iturbo.cc/commands/${category.toLowerCase()}#${i} '${this.store.get(i).aliases.length > 0 ? `\n${ctx.translate('commands/general/help:commandAliases', { aliases: this.store.get(i).aliases.join(', ') })}` : ''}') - ${this.store.get(i).description}`)

        Pagination.embed
          .setColor(this.client.constants.color)
          .setAuthor(ctx.translate('commands/general/help:category', { category }), this.client.user.displayAvatarURL({ size: 128, dynamic: true }))
          .setDescription(ctx.translate('commands/general/help:categoryDescription', { prefix: ctx.guild ? ctx.guild.settings.prefix : '|' }))
          .setFooter(ctx.translate('common:requestedBy', { requester: ctx.author.tag }), null)

        return Pagination.build()
      }

      const cmd = this.store.get(command.toLowerCase())
      if (!cmd) return ctx.tr('commands/general/help:doesNotExist')

      let cost = ctx.translate('commands/general/help:cost')

      if (cmd.cost && ctx.guild && ctx.guild.settings.social) {
        const premium = await this.client.verifyPremium(ctx.author)

        if (premium) {
          // Premium users get a 25% off the cost.
          cost = `¥${cmd.cost - Math.floor(cmd.cost / 2 / 2)}`
        } else {
          cost = `¥${cmd.cost}`
        }
      }

      if (cmd.nsfw && ctx.guild && !ctx.channel.nsfw) {
        return ctx.tr('commands/general/help:isNSFW')
      }

      const cmdArgs = []
      for (const [key, value] of Object.entries(cmd.arguments)) cmdArgs.push(`• \`${key}\` ${value}`)
      const cmdExamples = []
      for (const [key, value] of Object.entries(cmd.examples)) cmdExamples.push(`• \`${ctx.guild ? ctx.guild.settings.prefix : '|'}${cmd.name} ${key}\` ${value}`)

      const embed = new MessageEmbed()
        .setTitle(ctx.translate('commands/general/help:command', { command: this.client.utils.toProperCase(cmd.name) }))
        .setURL(`https://docs.iturbo.cc/commands/${cmd.category.toLowerCase()}#${cmd.name}`)
        .setColor(this.client.constants.color)
        .setDescription(cmd.description)
        .addField(ctx.translate('commands/general/help:commandUsage'), `${ctx.guild ? ctx.guild.settings.prefix : '|'}${cmd.usage}`)
        .addField(ctx.translate('commands/general/help:commandAliases'), cmd.aliases.length ? cmd.aliases.join(', ') : ctx.translate('common:none'))
      // eslint-disable-next-line prettier/prettier
      embed.addField(ctx.translate('commands/general/help:commandCategory'), cmd.category)
        .setFooter(`${ctx.translate('commands/general/help:commandCost', { cost })} • ${ctx.translate('commands/general/help:commandCooldown', { cooldown: cmd.cooldown ? `${cmd.cooldown} Seconds` : ctx.translate('common:none') })}`)

      if (cmd.extendedHelp !== ctx.translate('commands/general/help:noExtendedHelp')) embed.addField(ctx.translate('commands/general/help:extendedHelp'), cmd.extendedHelp)

      const examplesEmbed = new MessageEmbed()
        .setTitle(ctx.translate('commands/general/help:command', { command: this.client.utils.toProperCase(cmd.name) }))
        .setURL(`https://docs.iturbo.cc/commands/${cmd.category.toLowerCase()}#${cmd.name}`)
        .setColor(this.client.constants.color)
        .setFooter(`${ctx.translate('commands/general/help:commandCost', { cost })} • ${ctx.translate('commands/general/help:commandCooldown', { cooldown: cmd.cooldown ? `${cmd.cooldown} Seconds` : ctx.translate('common:none') })}`)

      if (cmdArgs.length) examplesEmbed.addField(ctx.translate('commands/general/help:commandArguments'), cmdArgs.join('\n'))
      if (cmdExamples.length) examplesEmbed.addField(ctx.translate('commands/general/help:commandExamples'), cmdExamples.join('\n'))

      const embeds = [embed, examplesEmbed]
      if (!cmdArgs.length && !cmdExamples.length) return ctx.reply({ embed })

      const Pagination = new Embeds()
        .setArray(embeds)
        .setAuthorizedUsers([ctx.author.id])
        .setChannel(ctx.channel)
        .setPage(page)
        .setDisabledNavigationEmojis(['delete'])
        .setPageIndicator('footer', (page, pages) => `${ctx.translate('commands/general/help:commandCost', { cost })} • ${ctx.translate('commands/general/help:commandCooldown', { cooldown: cmd.cooldown ? `${cmd.cooldown} Seconds` : ctx.translate('common:none') })} • ${ctx.translate('page', { page: page, pages: pages })}`)

      return Pagination.build()
    }

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 128, dynamic: true }))
      .setTitle(ctx.translate('commands/general/help:title'))
      .setURL('https://docs.iturbo.cc/commands')
      .setDescription(ctx.translate('commands/general/help:baseDesc', { prefix: ctx.guild ? ctx.guild.settings.prefix : '|' }))
      .addField(ctx.translate('commands/general/help:baseAvail'), keys.map(key => `[\`${key}\`](https://docs.iturbo.cc/commands/${key.toLowerCase()})`).join(' '))
      .setImage('https://i.imgur.com/g3jV9fg.gif')

    /*     for (const category of keys) {
          // Skip un-needed categories
          if (category === "Social" && ctx.guild && !ctx.guild.settings.social) continue;
          if (category === "Nsfw" && ctx.guild && !ctx.channel.nsfw) continue;
          embed.addField(category, `${map[category].map(i => `[\`${i}\`](https://turbo.ooo ${this.store.get(i).description})`).join(' ')}`);
        } */

    return ctx.reply({ embed })
  }
}

module.exports = Help
