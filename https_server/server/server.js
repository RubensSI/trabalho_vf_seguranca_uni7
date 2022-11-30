const express = require('express')
const fs = require('fs')
const https = require('https')
const path = require('path')

const app = express()
const directoryToServer = 'client'
const port = 3443

app.use('/', express.static(path.join(__dirname, '..', directoryToServer)))

const httpsOption = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl/certs', 'server.csr')),
  key: fs.readFileSync(path.join(__dirname, 'ssl/certs', 'server.key'))
}

https.createServer(httpsOption, app)
  .listen(port, function () {
    console.log(`Inciando o ${directoryToServer}/ em https://localhost:${port}`)
  })



