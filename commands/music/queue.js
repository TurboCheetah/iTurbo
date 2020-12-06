const Command = require('../../structures/Command.js')
// const { MessageEmbed } = require('discord.js')
const { FieldsEmbed } = require('discord-paginationembed')

class Queue extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Displays the music queue',
      aliases: ['q'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'queue [page]',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx, [page = 1]) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue || queue === undefined) {
      return ctx.reply('There is nothing in the queue!')
    }

    let upcoming = queue.songs.filter((song, id) => id > 0)

    /* const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| ${ctx.guild.name}'s Queue`, ctx.guild.iconURL({ size: 512 }))
      .setTitle(`🔊 Now playing: ${queue.songs[0].name}`)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      .setDescription(`**Up next**\n${upcoming.length === 0 ? 'No upcoming songs' : upcoming}`)
      .setFooter(`Total length: ${queue.formattedDuration}`)
    ctx.reply({ embed }) */

    upcoming = [
      {
        youtube: false,
        user: {
          id: '120306174225678336',
          bot: false,
          username: 'Turbo - ターボ',
          discriminator: '2665',
          avatar: '16e27bc5c4f678a55ffaa9df03cda5d7',
          flags: 131136,
          lastMessageChannelID: '609626201039831048',
          createdTimestamp: 1448753627116,
          defaultAvatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
          tag: 'Turbo - ターボ#2665',
          avatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
          displayAvatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
        },
        id: '652995428',
        name: 'Horse Head & YAWNS - Celebrity Tinder feat. Cold Hart',
        isLive: false,
        duration: 171,
        formattedDuration: '02:51',
        url:
          'https://soundcloud.com/horsehead1990/celebrity-tinder-feat-cold-hart',
        streamURL:
          'https://cf-media.sndcdn.com/cfaFQTVzbxbY.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vY2ZhRlFUVnpieGJZLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MDcyODEzNjV9fX1dfQ__&Signature=apSnIXnie0qwJFaYMXPyoWyvkLslcZmS1G3yTxrvE3rEqQtRAs5LyUplpm8iGF~gENj0vZ6zfBuihP-FpEcdVIy21yWRkjQ123lNR-f3bzw~xeMJ0enz0gWMLOJPc-lhGsCUaYqABsE5xK5JWUoVR5-KzouW2OXIJxsunHhq3IT2pbkEhuWLvQKtVRXpc4MMtK3D7piRGK~Zr4Xda-sEDGseAvlzm90A5xy29ZkXXdlxN89OJp~2SWmejHjjUDKAb5ALRcLzVesprCZBKZSuDz47Dhf2c3PCGvczO9AryirM2SgCvKClheKtjkLuh6TmFsqo6IOfPfjPwF4lf07y8w__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ',
        thumbnail:
          'https://i1.sndcdn.com/artworks-000569241728-v3dmdb-original.jpg',
        views: 56985,
        plays: 56985,
        likes: 1247,
        dislikes: 0,
        reposts: 69,
        title: 'Horse Head & YAWNS - Celebrity Tinder feat. Cold Hart',
        link:
          'https://soundcloud.com/horsehead1990/celebrity-tinder-feat-cold-hart',
      },
      {
        youtube: false,
        user: {
          id: '120306174225678336',
          bot: false,
          username: 'Turbo - ターボ',
          discriminator: '2665',
          avatar: '16e27bc5c4f678a55ffaa9df03cda5d7',
          flags: 131136,
          lastMessageChannelID: '609626201039831048',
          createdTimestamp: 1448753627116,
          defaultAvatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
          tag: 'Turbo - ターボ#2665',
          avatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
          displayAvatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
        },
        id: '639109527',
        name: 'Horse Head & YAWNS - D.O.A. feat. Zubin',
        isLive: false,
        duration: 236,
        formattedDuration: '03:56',
        url:
          'https://soundcloud.com/horsehead1990/horse-head-yawns-doa-feat-zubin',
        streamURL:
          'https://cf-media.sndcdn.com/OkeMB37ZzL6a.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vT2tlTUIzN1p6TDZhLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MDcyODE0MzN9fX1dfQ__&Signature=feFYa78FjrkFf-OX3y1fnIDTYDZygnT-m4e7DkLOW-FB4WTLttlZTGvKLEysomgZw6FSx2HdyAA0bWkM97rymvl-K-W2AiPG6qWXzN8l0tBRV6aNW5x~8fDBou2LfDTyAnU68LZ-MOoKhNwktDJMOiLalLRewVSwS4Vb-SpYdk2g5nObsux9IOIAY-TPIt4t73lIfGABJOU~JIEy4e~9WC5LYWvSUZk8NFQ7BiR9JWY5JYXo4sz-vqgmLTiU~jsPl5lnU67zPiNa3wtxuOI8j4gcQ024qcftFNfIKyBBdrDQfmTEBSpPIaTO3ZDl3e82yTKF34ZlR8NYgx34nektkw__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ',
        thumbnail:
          'https://i1.sndcdn.com/artworks-000554609394-u2g9xo-original.jpg',
        views: 258679,
        plays: 258679,
        likes: 4735,
        dislikes: 0,
        reposts: 280,
        title: 'Horse Head & YAWNS - D.O.A. feat. Zubin',
        link:
          'https://soundcloud.com/horsehead1990/horse-head-yawns-doa-feat-zubin',
      },
      {
        youtube: false,
        user: {
          id: '120306174225678336',
          bot: false,
          username: 'Turbo - ターボ',
          discriminator: '2665',
          avatar: '16e27bc5c4f678a55ffaa9df03cda5d7',
          flags: 131136,
          lastMessageChannelID: '609626201039831048',
          createdTimestamp: 1448753627116,
          defaultAvatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
          tag: 'Turbo - ターボ#2665',
          avatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
          displayAvatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
        },
        id: '621830151',
        name: 'Horse Head & YAWNS - Such A Drag',
        isLive: false,
        duration: 130,
        formattedDuration: '02:10',
        url:
          'https://soundcloud.com/horsehead1990/horse-head-yawns-such-a-drag',
        streamURL:
          'https://cf-media.sndcdn.com/yh0lZhlcWZMv.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20veWgwbFpobGNXWk12LjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MDcyODEzMjh9fX1dfQ__&Signature=IVL83h~arTKEpZa~NaN6Y2F6MXO417QQlRYn92tvYddTY~qd5e8sbLdIwT8mAdtgHz9GIKyT9B4V5Erv1~QdcXbdk0dZ2mn0tbC0aGuiQbKL9-i~K9MZo0AY8XbM-goBzRyAtPdIiia8vS9mKSvA~gtgjafzVSw~45g7Vb7xkwXYx4OmcUsqOvmrU2iW-jqwZGcpaFKsxHzkzFELdBU43lL6RqAdV3VYujCMAt5LCMZONs6GBZmbS5zkpRHMLueWUTkhCTnZ-11yYjreQJUZLA2M98hfBvawycT3m~IHUKkSoo6SEc78OWZJaOJ3KkXXObacPb2P5ZG96bvVe0H~Ng__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ',
        thumbnail:
          'https://i1.sndcdn.com/artworks-000536342712-yc8koo-original.jpg',
        views: 260742,
        plays: 260742,
        likes: 4748,
        dislikes: 0,
        reposts: 305,
        title: 'Horse Head & YAWNS - Such A Drag',
        link:
          'https://soundcloud.com/horsehead1990/horse-head-yawns-such-a-drag',
      },
      {
        youtube: false,
        user: {
          id: '120306174225678336',
          bot: false,
          username: 'Turbo - ターボ',
          discriminator: '2665',
          avatar: '16e27bc5c4f678a55ffaa9df03cda5d7',
          flags: 131136,
          lastMessageChannelID: '609626201039831048',
          createdTimestamp: 1448753627116,
          defaultAvatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
          tag: 'Turbo - ターボ#2665',
          avatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
          displayAvatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
        },
        id: '652995545',
        name: 'Horse Head & YAWNS - Jewelery',
        isLive: false,
        duration: 171,
        formattedDuration: '02:51',
        url: 'https://soundcloud.com/horsehead1990/jewlery',
        streamURL:
          'https://cf-media.sndcdn.com/2wTnZ1sAjWqE.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vMndUbloxc0FqV3FFLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MDcyODEzNzF9fX1dfQ__&Signature=DiTEpZ5nVjrqXhI9jR1SjE8FPIxEBZp8VZUJYD-Mh7rrUNDM5Z3TlYhab4ChaTVBaZ69WwLkiqQlINeEATB-n7wW6UU3t~rrFvmJaPf~sOwo9hEmUe3epPdjQ5uICcQBJt20k-~AwCf7-GT8g3uze-Vac7j7Sv82tSiDu-wM-V0Ty7LJPMZAAzGpHmpaA5qpxFkOT0bl1pwbS-lrbily2Q4WzV8lPyg8ue0gosF42sS-5ru5ayWNYVSaMgnE4~wdZDBpcOfZY7PSDVY6MPbnMSRSH5fsgUz9ruGg6FkSJjnZEXAPOqPLhXtd8oxu3HAqIroaIYdBf5FbHM1rmFewvg__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ',
        thumbnail:
          'https://i1.sndcdn.com/artworks-000569241827-s1riee-original.jpg',
        views: 32097,
        plays: 32097,
        likes: 725,
        dislikes: 0,
        reposts: 51,
        title: 'Horse Head & YAWNS - Jewelery',
        link: 'https://soundcloud.com/horsehead1990/jewlery',
      },
      {
        youtube: false,
        user: {
          id: '120306174225678336',
          bot: false,
          username: 'Turbo - ターボ',
          discriminator: '2665',
          avatar: '16e27bc5c4f678a55ffaa9df03cda5d7',
          flags: 131136,
          lastMessageChannelID: '609626201039831048',
          createdTimestamp: 1448753627116,
          defaultAvatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
          tag: 'Turbo - ターボ#2665',
          avatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
          displayAvatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
        },
        id: '652995515',
        name: 'Horse Head & YAWNS - End Of A Good Thing',
        isLive: false,
        duration: 164,
        formattedDuration: '02:44',
        url: 'https://soundcloud.com/horsehead1990/end-of-a-good-thing',
        streamURL:
          'https://cf-media.sndcdn.com/CuvEDqYFxD0n.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vQ3V2RURxWUZ4RDBuLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MDcyODEzNjV9fX1dfQ__&Signature=dOsxDqAaLMwn-xb0HXy3HQH-AXLhPLsw2Y-Uv02bDv7xW-14sS1kIQrjrzZ--QsxVUwwpSj6umdsp~7zl86opNEfPelHKEC-bYbla1bmUulMo1MObn~uCcKf8CtGtGIY5dy8zMEFDV7b~sEjUf-JLl2ayjxWeEw9EX0PQv75WJ6fwnPHO4LEThvEgqcB8haALlso1yiJ4s7R~iVQ7Con31hn1KjCgdC~PLB7wJdQvYdRRf1HjxqtRz1Us0504hZxJhrOS-u0mqR00PZoPe0llVJSushkgptqLXJVorACp4lL104ID76RI6tFTgjjQx2UOEgkndqT0bMj-TNZ1UazdA__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ',
        thumbnail:
          'https://i1.sndcdn.com/artworks-000569241809-4jdzm2-original.jpg',
        views: 34306,
        plays: 34306,
        likes: 713,
        dislikes: 0,
        reposts: 55,
        title: 'Horse Head & YAWNS - End Of A Good Thing',
        link: 'https://soundcloud.com/horsehead1990/end-of-a-good-thing',
      },
      {
        youtube: false,
        user: {
          id: '120306174225678336',
          bot: false,
          username: 'Turbo - ターボ',
          discriminator: '2665',
          avatar: '16e27bc5c4f678a55ffaa9df03cda5d7',
          flags: 131136,
          lastMessageChannelID: '609626201039831048',
          createdTimestamp: 1448753627116,
          defaultAvatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
          tag: 'Turbo - ターボ#2665',
          avatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
          displayAvatarURL:
            'https://cdn.discordapp.com/avatars/120306174225678336/16e27bc5c4f678a55ffaa9df03cda5d7.webp',
        },
        id: '652995482',
        name: 'Horse Head & YAWNS - Desert Island',
        isLive: false,
        duration: 173,
        formattedDuration: '02:53',
        url: 'https://soundcloud.com/horsehead1990/desert-island',
        streamURL:
          'https://cf-media.sndcdn.com/tx92pu2AJ2ke.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vdHg5MnB1MkFKMmtlLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MDcyODEzNzZ9fX1dfQ__&Signature=PCiF91OopStrmu0xJTXslWlaUI-J9~F6mzki9sea0~HErcDjdbjzoGrnqhqdJiQinwk5cj8p~SGUmp445Ifj8iQzKdnIswFjFgf1-KZGuyKqHeS0gnhze8tMYQTTG7fEJwjQYSxjWzTLrx8Np9dAIIjXuskr3sPLrJcI5HL9d8H6hFEqd4Rt7~xcekI8dSDxFZaSnp5sECu~sTdZPTsWCPt7VsftWDNOpqooakxViefXD-zCG54OluzBU8s--mVlOK0W4fhfkWQj6lcMl-pb0aQsJBZQagX63RCCi-DYMKVFtRkiHhBrf0pZfe7eMrmluOA5Hw0tpHcgUC-rG4bUSw__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ',
        thumbnail:
          'https://i1.sndcdn.com/artworks-000569241791-mivpym-original.jpg',
        views: 42330,
        plays: 42330,
        likes: 868,
        dislikes: 0,
        reposts: 61,
        title: 'Horse Head & YAWNS - Desert Island',
        link: 'https://soundcloud.com/horsehead1990/desert-island',
      },
    ];

    const Pagination = new FieldsEmbed()
      .setArray(upcoming)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setElementsPerPage(5)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `Requested by ${ctx.author.tag} | Page ${page} of ${pages}`)
      .formatField('Up Next', song => `**${song.indexOf(upcoming) + 2}**. [${song.name}](${song.url}) requested by ${song.user}`)

    //upcoming = upcoming.map((song, id) => `**${id + 2}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join('\n')

    Pagination.embed
      .setColor(0x9590EE)
      .setAuthor(`| ${ctx.guild.name}'s Queue`, ctx.guild.iconURL({ size: 512 }))
      .setTitle(`🔊 Now playing: ${queue.songs[0].name}`)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      // .setDescription(`**Up next**\n${upcoming.length === 0 ? 'No upcoming songs' : upcoming}`)
      .setFooter(`Total length: ${queue.formattedDuration}`, ctx.author.displayAvatarURL({ size: 64 }))

    return Pagination.build()
  }
}

module.exports = Queue
