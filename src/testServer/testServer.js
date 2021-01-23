const { format: formatPath, parse: parsePath, join: joinPath, sep: SEP } = require('path')
const { promises: fsAsync, createReadStream: rStream } =require('fs')
const { Transform, pipeline } = require('stream')
const { EventEmitter } = require('events')
const { inherits, promisify } = require('util')
const http = require('http')
const { Request_Cache } = require('../../lib/RequestCache')

/* ~*~**~*~*~*~**~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
*                          *** MAIN ***
*  ~*~*~*~*~*~*~**~**~**~*~~**~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~**~~* */
const _request_cache = Request_Cache
const http_server = http.createServer()
http_server.cfg = require('../../cfg/http_server.json')
const { GadgetJs } = require('../../app.js')
const app = new GadgetJs()
app.emit('SERVER-UP')

http_server.on('error', (e) => console.warn(e))

http_server.on('INFO_EVENT', (m) => console.info(m))


http_server.on('GET', (request, response) => {
        const _router = new Router(request, response)
        http_server.emit('CLIENT_READY_RESPONSE', _router)
    })

http_server.once('POST', (request, response) => {

})

http_server.on('connection', (c) => {
    http_server.emit('INFO_EVENT', `New Client Connection from http://${ c.remoteAddress }:${ c.remotePort }`)
})
http_server.on('listening',() =>  http_server.emit('INFO_EVENT', 'Server is up....'))

http_server.on('request', (request, response) => {
    let { method } = request
    http_server.emit(method.toUpperCase().trim(), request, response)
   
    http_server.once('CLIENT_READY_RESPONSE', (_router) => {
        let responseLocation = _router.responseLocation()
        let responseData = _router.responseData(responseLocation)
        let responseOrigin = _router.responseOrigin()
        let contentType = _router.responseContentType(_router.ext)
        let responseCookie = _router.responseCookie()
        let _response = _request_cache.reqPipe(_router.uid, null)
        let responseHeaders = clientHeaders(responseOrigin, contentType)
        let stream =  responseHeaders ? clientResponse(_response, responseData)
                        : process.nextTick(clientResponse, _response, responseData)
      
        
       async function clientHeaders(_origin, _contentType) {
            _router.responseHeaders(_origin, _contentType)
            return response.sentHeaders
       }
       
      function clientResponse(_response, responseLocation) {
            pipeline(
                responseLocation,
                _response,
                (err) => { err ? console.error(err) : !err }
            )
          
       }
       
        
    })
    
    http_server.emit(request.method.toUpperCase().trim(), request, response)
})

//--------------------------------------------------------------------
//  ** FUNCTIONS -------------------->

function Router (request, response) {
    let { url: reqUrl, headers: reqHeaders } = request
    let uid =  _request_cache.uid(8)
    let _location =  location = joinPath(__dirname,'..', '..', 'doc', reqUrl)
    let { dir, base, name: pathName, ext } = parsePath(_location)
    this.request = request
    this.response = response
    this.name = '_router'
    this.uid = _request_cache.add(uid, response)
    this.location = _location
    this.ext = ext
    this.dir = dir
    this.base = base
    this.pathName = pathName
    this.url = new URL(`http://${ request.socket.localAddress }:${ request.socket.localPort }/doc${ request.url }`)
    this.headers = reqHeaders
    return this
}
Router.prototype.responseData = function(_responseLocation) {
    return rStream(this.location, 'UTF-8')
}
Router.prototype.responseLocation = function () {
    return this.location
}

Router.prototype.responseContentType = function(ext) {
    let mimetypeTable = require('../../cfg/mimeTypes.json')
    !ext.startsWith('.') ? ext = '.' + ext.trim()
                         : ext.trim()
    
   return ( ext in mimetypeTable ? mimetypeTable[ext]
                         : mimetypeTable['text/plain'])
}

Router.prototype.responseOrigin = function() {
   return this.origin
}

Router.prototype.responseCookie = function() {
        let _responsePipe = _request_cache.reqPipe(this.uid)
        _responsePipe === this.response ? _responsePipe.setHeader('setCookie', [`uid=${ this.uid }`])
                                        : http_server.emit('error', `posting data to wrong pipe: ${ Object.keys(_responsePipe) }`)
}

Router.prototype.responseHeaders = function(_origin, _contentType) {
        let _responsePipe = _request_cache.reqPipe(this.uid)
        _responsePipe.writeHead(200, {
            'Content-Type': _contentType,
            'Transfer-Encoding': 'chunked',
            'Connection': 'Keep-alive',
            'Access-Control-Allow-Origin': this.url.origin
    })
    
    return true
}


module.exports ={ http_server }


//http_server.listen(9022, 'localhost')