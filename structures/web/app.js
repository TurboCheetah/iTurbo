const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const middlewares = require('./middlewares')

module.exports = (client) => {
  const app = express()
  const port = client.config.port || 5000
  let url = 'https://iturbo.turbo.ooo'

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

  app.get('/playlist/:userID/:playlistName', (req, res) => {
    const id = req.params.userID
    const playlistName = req.params.playlistName
    const data = client.settings.users.get(id).playlist.playlists[playlistName]
    if (data === undefined) return res.status(404).json({ message: 'Not found' })
    if (data.public === false) return res.status(403).json({ message: 'Forbidden' })
    res.json({ data })
  })

  app.use(middlewares.notFound)
  app.use(middlewares.errorHandler)

  app.listen(port, () => {
  /* eslint-disable no-console */
    console.log(`Loaded webserver at ${url}`)
  /* eslint-enable no-console */
  })
}
