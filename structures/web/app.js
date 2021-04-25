const express = require('express')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const middlewares = require('./middlewares')

module.exports = client => {
  const app = express()
  const port = client.config.api.port || 5000
  let url = 'https://iturbo.cc'

  if (client.dev === true) {
    app.use(morgan('dev'))
    url = `http://localhost:${port}`
  }
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", 'cdn.turbo.ooo'],
          fontSrc: ["'self'", 'fonts.google.com', 'fonts.gstatic.com', 'cdn.turbo.ooo'],
          styleSrc: ["'self'", 'cdn.turbo.ooo', "'unsafe-inline'"],
          scriptSrc: ["'self'", 'cdn.turbo.ooo'],
          imgSrc: ["'self'", 'cdn.turbo.ooo', 'i.turbo.ooo']
        }
      }
    })
  )
  app.use(cors())
  app.use(express.json())
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views/'))
  app.set('view engine', 'ejs')

  /* Main routes */

  // Serve index
  app.get('/', (req, res) => {
    // res.redirect(301, 'https://turbo.ooo')
    res.render('index')
  })

  // Redirect to bot invite
  app.get('/invite', (req, res) => {
    res.redirect(301, 'https://discord.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot')
  })

  // Redirect to support guild
  app.get('/support', (req, res) => {
    res.redirect(301, 'https://discord.gg/011UYuval0uSxjmuQ')
  })

  /* API Routes */

  // Serve individual playlist data
  app.get('/playlist/:userID/:playlistName', async (req, res) => {
    const id = req.params.userID
    const playlistName = req.params.playlistName
    const userSettings = await client.settings.users.sync(id)
    const data = userSettings.playlist[playlistName]
    if (!data) return res.status(404).json({ message: 'Not found' })
    if (data.public === false) return res.status(403).json({ message: 'Forbidden' })
    if (req.headers['user-agent'] === `iTurbo/${client.version} (DiscordBot)`) return res.json(data)
    res.render('playlist', { data: data })
  })

  // WIP
  // Serve guild queue
  app.get('/player/:guildID/', async (req, res) => {
    const id = req.params.guildID
    if (!client.manager.players.get(id)) return res.status(404).json({ message: 'Guild is not playing music' })
    const current = client.manager.players.get(id).queue.current
    let queue = client.manager.players.get(id).queue
    if (!current) return res.status(404).json({ message: 'Guild is not playing music' })
    if (!queue) queue = {}
    res.json({ current, queue })
  })

  app.use(middlewares.notFound)
  app.use(middlewares.errorHandler)

  app.listen(port, () => {
    /* eslint-disable no-console */
    client.logger.success(`Loaded webserver at ${url}`)
    /* eslint-enable no-console */
  })
}
