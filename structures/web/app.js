const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const middlewares = require('./middlewares')

module.exports = (client) => {
  const app = express()
  const port = client.config.api.port || 5000
  let url = 'https://iturbo.cc'

  if (client.dev === true) {
    app.use(morgan('dev'))
    url = `http://localhost:${port}`
  }
  app.use(helmet())
  app.use(cors())
  app.use(express.json())

  app.get('/', (req, res) => {
    res.redirect(301, 'https://turbo.ooo')
  })

  app.get('/invite', (req, res) => {
    res.redirect(301, 'https://discord.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot')
  })

  app.get('/playlist/:userID/:playlistName', async (req, res) => {
    const id = req.params.userID
    const playlistName = req.params.playlistName
    const data = await client.settings.users.get(id).playlist[playlistName]
    if (!data) return res.status(404).json({ message: 'Not found' })
    if (data.public === false) return res.status(403).json({ message: 'Forbidden' })
    res.json(data)
  })

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
    console.log(`Loaded webserver at ${url}`)
  /* eslint-enable no-console */
  })
}
