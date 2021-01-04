module.exports = {
  apps: [
    {
      name: 'Bot',
      script: 'index.js',
      env: {
        NODE_ENV: 'dev'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
