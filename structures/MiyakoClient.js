const { Client } = require('discord.js')
const CommandStore = require('./CommandStore.js')
const EventStore = require('./EventStore.js')
const MemorySweeper = require('../utils/cleanup.js')
const Points = require('../monitors/points.js') // Implement better way when we have more monitors.
const { Pool } = require('pg')
const DBL = require('dblapi.js')
const DBLMock = require('../utils/DBLMock.js')
const loadSchema = require('../utils/schema.js')
const Settings = require('./Settings.js')
const presences = require('../assets/json/presences.json')
const imgapi = require('img-api')
const DisTube = require('distube')
const { GiveawaysManager } = require('discord-giveaways')

class MiyakoClient extends Client {
  constructor (dev) {
    super({
      fetchAllMembers: false,
      disableMentions: 'everyone',
      messageCacheMaxSize: 100,
      messageCacheLifetime: 240,
      messageSweepInterval: 300
    })

    this.dev = dev || false
    this.config = require('../config.json')
    this.console = console // TODO: Implement a console logger.
    this.constants = require('../utils/constants.js')
    this.commands = new CommandStore(this)
    this.utils = require('../utils/Utils.js') // Easier to access everywhere.
    this.events = new EventStore(this)
    this.sweeper = new MemorySweeper(this)
    this.responses = require('../utils/responses.js')
    this.img = new imgapi.Client({ host: this.config.imgapi })
    this.distube = new DisTube(this, { searchSongs: true, emitNewSongOnly: true, highWaterMark: 1 << 25, customFilters: { purebass: 'bass=g=20,dynaudnorm=f=200,asubboost' } }) // Distube instance for playing music
    this.version = '1.0.5'

    // More DisTube stuff
    this.distube.on('playSong', (msg, queue, song) => this.emit('playSong', msg, queue, song))
      .on('addSong', (msg, queue, song) => this.emit('addSong', msg, queue, song))
      .on('playList', (msg, queue, playlist, song) => this.emit('playList', msg, queue, playlist, song))
      .on('addList', (msg, queue, playlist) => this.emit('addList', msg, queue, playlist))
    // DisTubeOptions.searchSongs = true
      .on('searchResult', (msg, result) => this.emit('searchResult', msg, result))
    // DisTubeOptions.searchSongs = true
      .on('searchCancel', (msg) => this.emit('searchCancel', msg))
      .on('error', (msg, err) => this.emit('songError', msg, err))

    const manager = new GiveawaysManager(this, {
      storage: './giveaways.json',
      updateCountdownEvery: 30000,
      default: {
        botsCanWin: false,
        exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        embedColor: this.constants.color,
        reaction: '🎉'
      }
    })

    this.giveawaysmanager = manager

    // Settings.
    this.settings = {
      guilds: new Settings(this, 'guilds'),
      members: new Settings(this, 'members'),
      users: new Settings(this, 'users'),
      store: new Settings(this, 'store')
    }

    this.dbl = this.config.dbl && !this.dev ? new DBL(this.config.dbl, this) : new DBLMock()
    this.points = new Points(this)
    this.on('ready', this.onReady.bind(this))

    const { host, user, password, database } = this.config.postgresql
    this.db = new Pool({ host, user, password, database })
    this.dbconn = null
  }

  onReady () {
    this.ready = true
    this.console.log(`Logged in as ${this.user.tag}`)
    this.emit('miyakoReady')
  }

  async login () {
    await this.init()
    const { devtoken, token } = this.config
    return super.login(this.dev ? devtoken : token)
  }

  rollPresence () {
    const { message, type } = this.utils.random(presences)
    return this.user.setActivity(message.replace(/{{guilds}}/g, this.guilds.cache.size), { type })
      .catch(() => null)
  }

  /**
   * Check if a given user is a premium user.
   * @returns {Promise<Boolean>}
   */
  async verifyPremium (user) {
    // First grab the support guild.
    const guild = this.guilds.cache.get(this.constants.mainGuildID)

    try {
      // Grab the member.
      const member = await guild.members.fetch(user)
      // See if they have the role.
      return member.roles.cache.has(this.constants.premiumRole)
    } catch (err) {
      // If an error happens, e.g member is not in the support guild then just return false.
      return false
    }
  }

  async init () {
    // Load pieces.
    const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()])
    this.console.log(`Loaded ${commands} commands.`)
    this.console.log(`Loaded ${events} events.`)

    // Connect database.
    this.dbconn = await this.db.connect()
    this.console.log('Connected to PostgreSQL')

    // Initialize schema.
    await loadSchema(this.db)

    // Initialize settings.
    for (const [name, settings] of Object.entries(this.settings)) {
      await settings.init()
      this.console.log(`Loaded ${settings.cache.size} ${name}`)
    }
  }
}

module.exports = MiyakoClient
