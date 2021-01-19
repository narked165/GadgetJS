const { format: formatPath, parse: parsePath, join: joinPath, sep: SEP } = require('path')
const { promises: fsAsync, createReadStream: rStream } =require('fs')
const { Transform, pipeline } = require('stream')
const { EventEmitter } = require('events')
const { inherits, promisify } = require('util')
const http = require('http')


/* ~*~**~*~*~*~**~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
*                          *** MAIN ***
*  ~*~*~*~*~*~*~**~**~**~*~~**~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~**~~* */
const http_server = http.createServer()
http_server.on('error', (e) => console.warn(e))

http_server.on('INFO_EVENT', (m) => console.info(m))


http_server.once('GET', (request, response) => {
  let _router = new Router(request, response)
   
   
   
    
})

http_server.once('POST', (request, response) => {
    


})

http_server.on('connect', (c) => {
    http_server.emit('INFO_EVENT', `New Client Connection from http://${ c.remoteAddress }:${ c.remotePort }`)
})
http_server.on('request', (request, response) => {

    http_server.once('CLIENT_READY_RESPONSE', (opt) => {
            let { _uid, _location } = opt
        let responseData = responseLocation(_location)
        let origin = responseOrigin(request)
        let _contentType = responseContentType(request.url)
        let _responseHeaders =  responseHeaders(origin, _contentType, response)
        
        pipeline(
            responseData,
            response,
            (err) => {err ? http_server.emit(err): !err}
        )
       
        
    })
    
    http_server.emit(request.method.toUpperCase().trim(), request, response)
})

//--------------------------------------------------------------------
//  ** FUNCTIONS -------------------->


function responseLocation(_location) {
    return rStream(_location, 'UTF-8', (err) => {
        err ? this.emit('error', err)
            : http_server.emit('INFO_EVENT', `The Location was successfully transformed, into a stream.` )
    })
}

function convertExt2Ctype(ext) {
    let mimetypeTable = require('../../cfg/mimeTypes.json')
    !ext.startsWith('.') ? ext = '.' + ext.trim()
                         : ext.trim()
   return ( ext in mimetypeTable ? mimetypeTable[ext]
                         : mimetypeTable['text/plain'])
}

function responseOrigin(request) {
    let rhost = request.socket.remoteAddress
    let rport = request.socket.remotePort
    let rurl = new URL(`http://localhost:${ rport }`)
    return rurl.origin
}

function responseContentType(reqUrl) {
    let { ext } = parsePath(reqUrl)
    return convertExt2Ctype(ext)
}

function responseHeaders(_origin, _contentType, response, _uid) {
    response.writeHead(200, {
        'Content-Type': _contentType,
        'Transfer-Encoding': 'chunked',
        'Connection': 'Keep-alive',
        'Access-Control-Allow-Origin': _origin,
        'Request-UID': _uid
    })
    
    return true
}
http_server.on('listening',() =>  http_server.emit('INFO_EVENT', 'Server is up....'))
http_server.listen(9022)