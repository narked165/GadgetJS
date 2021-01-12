const { createWriteStream: wStream, createReadStream: rStream,  promises: fsAsync } = require('fs')
const { join: joinPath, parse: parsePath, sep } = require('path')
const { inherits } = require('util')
const { duplex, Transform, pipeline } = require('stream')
const http = require('http')
const assert = require('assert')
const { parse: qsParser } = require('querystring')
const { pathToFileURL: path2file, fileURLToPath: file2path } = require('url')

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Router = require('../Router')
const ResponseHeaders = require('../ResponseHeaders')
const DataStream = require('../DataStream')
const tx_BodyParser = require('../tx_BodyParser')


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const http_server = http.createServer()

//  Import predefined server configurations
http_server.cfg = require('../../cfg/http_server.json')


//  Event handler - Error
http_server.on('error', err => {
    console.warn(`
    [!] [${ new Date().toLocaleTimeString() }] [ SYSTEM-EVENT-ERROR ]
        -> ${ err.name}  ${ err.code }
        -> DESCRIPTION: ${ err.message }
        ->    LOCATION: ${ err.stack }
    \n`)
})


//  Event handler - Listening
http_server.on('listening', () => {
    console.info(`
     [i] [${ new Date().toLocaleTimeString() }] [ SYSTEM-EVENT-HTTP-SERVER-UP  ]
        -> STATUS: Web Service has started.
        ->    URL: ${ http_server.cfg.url }
    \n`)
})

// Event handler = Close
http_server.on('close', () => {
   console.info(`
   [i] [${ new Date().toLocaleTimeString() }] [ SYSTEM-EVENT-CLOSE ]
        -> DESCRIPTION: Server connection has closed.
        ->         URL: ${ http_server.cfg.url }
        \n`)
})

// Event handler - Connection
http_server.on('connection', c => {
    let _CLIENT = new URL(`http://${ c.remoteAddress }:${ c.remotePort }`)
    
    //  Event Handler - request
    http_server.on('request', (request, response) => {
        let _router = new Router(request, response)
        let _response_headers = new ResponseHeaders()
        
        //  Event-Handler (Singleton) - Sends html error page to remote connected client
        http_server.once('CLIENT_ERROR_RESPONSE', (err) => {
        
        })
        
        //  Event Handler (Singleton) - Response Ready (Read Stream Instance)
        http_server.once('CLIENT_READY_RESPONSE_STREAM', (stream) => {
        
        })
    
    })
})

//  Event Handler - GET
http_server.on('GET', (request, response) => {

})

//  Event Handler - POST
http_server.on('POST', (request, response) => {

})

// Event Handler - PUT
http_server.on('PUT', (request, response) => {

})

//  Event Handler - DELETE
http_server.on('DELETE', (request, response) => {

})

//  Main Export = http_server
module.exports = { http_server }