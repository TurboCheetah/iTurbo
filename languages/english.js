/*
 * Authored-By: Raven (https://github.com/ravener/)
 * License: MIT License
 */

const Language = require('#structures/Language')
const responses = require('#utils/responses')

// English translation.
// This can be used as a template to start translating into a different language.
// So I've included comments to help you out with using this as a base.
// When copying the file to start a new translation please remove the unnecessary comments such as this

// Argument 1: Language name. This is the English name for the language that will be used to switch the language.
// Argument 2: Native name. This is the name of the language in the language itself, used for extra display.
// Argument 3: Keys. All the translations go here.
// Argument 4: Default language. Language to lookup keys from if one wasn't found in the current one. (see bottom of file)
module.exports = new Language('english', 'English', {
  // Translation keys are mostly incomplete as some English replies are still hardcoded
  // When translating this key to a different language please append two newlines (\n\n) and a translation of
  // **Note**: The (insert language name) translation is still incomplete
  languageSet: 'Language has been set to English',
  guildOnly: 'Baka! You can only use this command in a server. What are you doing in my DMs?',
  ownerOnly: "Baka! What do you think you're doing? That command is only for my master!",
  channelNotFound: 'I could not find that channel.',
  roleNotFound: 'That role does not exist.',
  mentionReminder: (prefix) => `Hi! Run \`${prefix}help\` for a list of commands you can use.`,
  didYouMean: (cmd) => `|\`❔\`| Did you mean \`${cmd}\`?`,
  none: 'None',
  seconds: 'Seconds',
  blacklisted: "You've been blacklisted from using the bot for abusive reasons. Please join https://discord.gg/mDkMbEh or contact Ravener#5796 for a chance to appeal.",
  blacklistedGuild: (guild) => `The server **${guild.name}** has been blacklisted from using the bot. If you are an Admin of the server please join https://discord.gg/mDkMbEh or contact Ravener#5796 for a chance to appeal.`,

  // These are random funny responses we use for some replies
  // Located in utils/responses.js
  // They can be translated too so look there.
  // I was lazy to move them here but that's a TODO
  welcomeMessages: responses.welcomeMessages,
  goodbyeMessages: responses.goodbyeMessages,
  levelMessages: responses.levelMessages,
  dailySuccessMessages: responses.dailySuccessMessages,
  pingMessages: responses.pingMessages,
  reloadErrorUnload: responses.reloadErrUnload,
  reloadNotFound: responses.reloadNotFound,
  reloadMissingArgument: responses.reloadMissingArg,
  levelupMessages: responses.levelUpMessages,

  // Categories.
  animals: 'Animals',
  anime: 'Anime',
  config: 'Config',
  fun: 'Fun',
  general: 'General',
  images: 'Images',
  miscellaneous: 'Miscellaneous',
  moderaiton: 'Moderation',
  music: 'Music',
  nsfw: 'NSFW',
  owner: 'Owner',
  programming: 'Programming',
  reactions: 'Reactions',
  search: 'Search',
  social: 'Social',
  utility: 'Utility',

  // General Stuff
  page: (page, pages) => `Page ${page} of ${pages}`,
  noReplyTimeout: (time) => `No reply within ${time} seconds. Time out.`,
  operationCancelled: 'Operation cancelled.',
  noResults: 'No results found.',
  reactForMore: 'React to view more details',

  // Animal Commands
  birdDescription: 'Grabs a random bird image',
  catDescription: 'Grabs a picture of a random cat',
  dogDescription: 'Grabs a random dog image',
  duckDescription: 'Grabs a random fox image',
  foxDescription: 'Grabs a random duck image',
  shibaDescription: 'Grabs a beautiful Shiba Inu image',
  lizardDescription: 'Grabs a random lizard image from nekos.life',

  // Anime Commands
  aavatarDescription: 'Get an anime avatar',
  aavatarExtenedHelp: 'The output will be NSFW only if the channel is a NSFW channel',
  anilistDescription: 'Search for anime, manga, or a user on Anilist.co',
  anilistUsage: 'anilist <query> | [page] [--anime | manga | user]',
  anilistPrompt: 'What would you like to search for?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.',
  anilistProfile: 'Profile',
  anilistEnglish: (title) => `**English Title:** ${title}\n`,
  anilistJapanese: (title) => `**Japanese Title:** ${title}\n`,
  anilistNoAbout: 'User does not have an about section.',
  anilistNoDescription: 'This anime does not have a description.',
  anilistType: 'Type',
  anilistTV: '📺 TV',
  anilistMovie: '🎬 Movie',
  anilistOVA: '💿 OVA',
  anilistEpisodes: 'Episode(s)',
  anilistChapters: 'Chapters(s)',
  anilistDuration: 'Duration',
  anilistVolumes: 'Volume(s)',
  anilistScore: 'Score',
  anilistFavorites: 'Favorites',
  anilistPopularity: 'Popularity',
  anilistGenres: 'Genres',
  anilistTopGenres: 'Top Genres',
  anilistAnimesWatched: 'Animes Watched',
  anilistEpisodesWatched: 'Episodes Watched',
  anilistPlanning: 'Planning to Watch',
  anilistTimeWatched: 'Time Watched',
  anilistMangaStats: 'Manga Stats',
  anilistMangasRead: 'Mangas Read',
  anilistVolumesRead: 'Volumes Read',
  anilistAnime: 'Anime',
  anilistManga: 'Manga',
  anilistCharacters: 'Characters',
  anilistStaff: 'Staff',
  anilistStudios: 'Studios',
  anilistID: (ID) => `ID: ${ID}`,
  kitsuDescription: 'Search an anime on Kitsu.io',
  kitsuUsage: 'kitsu <anime> | [page]',
  kitsuPrompt: 'What anime would you like to search for?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.',
  kitsuInvalidPage: (page, length) => `Invalid page ${page} there are only ${length} pages.`,
  kitsuJapanese: (title) => `Japanese: ${title}`,
  kitsuAgeRating: 'Age Rating',
  kitsuEpisodes: 'Episodes',
  kitsuEpisodeData: (count, length) => `${count} (${length} minutes per episode)`,
  myAnimeListDescription: 'Search an Anime on MyAnimeList',
  myAnimeListUsage: 'myanimelist <anime> | [page]',
  myAnimeListJapanese: (title) => `Japanese: ${title}`,
  myAnimeListAgeRating: 'Age Rating',
  myAnimeListEpisodes: 'Episodes',
  myAnimeListStatus: 'Status',
  myAnimeListScore: 'Score',
  myAnimeListRanking: 'Ranking',
  myAnimeListPopularity: 'Popularity',
  myAnimeListMembers: 'Members',
  myAnimeListFavorites: 'Favorites',
  myAnimeListStudio: 'Studio',
  myAnimeListStudios: 'Studios',
  myAnimeListGenre: 'Genre',
  myAnimeListGenres: 'Genres',
  myAnimeListName: 'Name',
  myAnimeListRole: 'Role',
  myAnimeListSeiyuu: 'Seiyuu',
  myAnimeListPrompt: 'What would you like to search for?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.',
  myAnimeListID: (ID) => `ID: ${ID}`,
  nekoDescription: 'Get a random Neko',
  waifuDescription: 'Sends a randomly generated Waifu from thiswaifudoesnotexist.net',

  // Config Commands
  // Fun Commands
  // General Commands
  // Image Commands
  // Miscellaneous Commands
  // Moderation Commands
  // Music Commands
  // NSFW Commands
  // Owner Commands
  // Programming Commands

  // Reaction Commands
  bakaDescription: 'Baka baka baka!',
  bakaUsage: 'baka [@user]',
  bakaResponse: (_, member) => `**${member.displayName}**, you baka!`,
  cuddleDescription: 'Cuddle someone',
  cuddleNoMention: 'You need to mention someone to cuddle with',
  cuddleSelf: "You can't cuddle yourself!",
  cuddleResponse: (author, member) => `**${member.displayName}**, you just got cuddled by **${author.displayName}**`,
  feedDescription: 'Feed someone',
  feedUsage: 'feed <@user>',
  feedNoMention: 'You need to mention someone to feed!',
  feedSelf: "You can't feed yourself!",
  feedResponse: (author, member) => `**${member.displayName}**, you just got fed by **${author.displayName}**`,
  pokeDescription: 'Poke someone',
  pokeUsage: 'poke <@user>',
  pokeNoMention: 'You need to mention someone to poke!',
  pokeSelf: "You can't poke yourself!",
  pokeResponse: (author, member) => `**${member.displayName}**, you just got poked by **${author.displayName}**`,
  smugDescription: 'Someone feels a bit smug',

  // Search Commands
  // Social Commands
  leaderboardTitle: (guild) => `${guild.name}'s Leaderboard`,
  leaderboardPosition: (position, points) => `You are rank **#${position}** on this server\nand you currenly have **¥${points}**`,
  leaderboardText: 'Leaderboard'
  // Utility Commands

  // Uncomment this line below when translating a different language.
  // it just makes English the default language to lookup keys that weren't found.
  // But since we are already in English we comment this out.
  // Just a note for those using the English file as template to start translating.
}/*, require("./english.js") */)
