const { createWriteStream: wStream, createReadStream: rStream,  promises: fsAsync } = require('fs')
const { join: joinPath, parse: parsePath, sep } = require('path')
const { inherits } = require('util')
const { duplex, Transform, pipeline } = require('stream')
const http = require('http')
const assert = require('assert')
const { parse: qsParser } = require('querystring')
const { pathToFileURL: path2file, fileURLToPath: file2path } = require('url')

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const { GadgetJs } = require('./app.js')
const app = new GadgetJs()
const { http_server } = require('./src/http_server')
app.once('SERVER-UP', () => {
    console.info(`
    [i] [INFO] [${ new Date().toLocaleTimeString()}] :: [SERVER-UP]
        MESSAGE: http-server has started.
    `)
})

app.once('NEW-DOCPATH', (docpath) => {
    console.info(`
        [i] [INFO] [${new Date().toLocaleTimeString()}] [ROUTER-NEW-DOCPATH]
            -> MESSAGE: Request processed for PATH: ${ docpath }
    \n`)
})
http_server.listen(http_server.cfg.port, http_server.cfg.host, () => {
    app.emit('SERVER-UP')
})


