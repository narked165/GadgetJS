const http = require('http'),
    https = require('https'),
    { Readable, pipeline } = require('stream'),
    { promises: fsAsync, fs } = require('fs'),
    { join: joinPath, parse: parsePath, sep} = require('path'),
http_service_config= require('../../cfg/http_server.json'),
    { Router } = require('../router/router'),
    { ResponseHeaders } = require('../ResponseHeaders/ResponseHeaders'),
    { Eve } = require('../Eve')
    
    
    const http_service_edge = {
    config: http_service_config,
    responseStream(assetPath) {
       return  new Promise((resolve, reject) => {
        let file = fsAsync.open(assetPath, 'r', 0o666)
           file
            .then(fd => {
                return [ fd, (fileHandle) => fileHandle.readFile({encoding: 'UTF-8'}) ]
                
            })
            .then(([ fd, data ]) => {
                data(fd)
                    .then(fileContents => {
                        fd.close()
                        resolve(new Readable.from(fileContents))
                    })
                    .finally(fd => fd ? fd.close() : !fd)
            })
            .catch(err => {
                err ? reject(err) : !err
                
            })
        })
    },
    http_service() {
        const http_server = http.createServer()
        http_server
            .on('error', (err) => {
                console.error(err)
            })
            .on('clientError', (err, sock) => {
                sock.on('error', (err) => console.error(err))
                console.warn(`[!] [ClientError] [${ new Date().toLocaleTimeString() }] :: ${ err }/r/n/r/n`)
                sock.end('HTTP/1.1 400 Bad Request\r\n\r\n')
               
            })
            .on('listening', () => {
                console.info(`[i] Server Online at ${ this.config.url }\r\n\r\n `)
            })
            .on('close', () => {
                console.info(`[i] Server has closed.\r\n\r\n`)
            })
            .on('end', () => {
                console.info(`[i] Server Stream has ended.\r\n\r\n`)
            })
            .on('socket', (NET_SOCK) => {
                NET_SOCK.on('error', (err) => console.trace(err))
                let client = new URL(`http://${ NET_SOCK.remoteAddress }:${ NET_SOCK.remotePort }`)
                console.info(`[i] Server has initiated a new network-socket-session with client: ${ client.origin }\r\n\r\n`)
            })
            .on('request', (request, response) => {
                response.on('finish', () => response.end(''))
                response.on('error', (err) => err ? console.error(err) : !err)
                let _router = new Router(request, response),
                    _responseHeaders = new ResponseHeaders(request, response)
                    clientResponse = _router.routeRequest(),
                        requestType = new _router.routeResponse(request.url)
                    console.info(requestType)
                clientResponse.then(assetPath => {
                  let header_d = _responseHeaders.setCommonDefaults(),
                      header_c = _responseHeaders.setCORSOrigin(),
                      header_t = _responseHeaders.setContentType(),
                      header_s = _responseHeaders.setStatus(),
                      headersSet = Boolean( header_d && header_c && header_t && header_s )
                                 ? _responseHeaders.buildHeaders()
                                     && this.responseStream(assetPath)
                        .then(docstream => {
                            pipeline(
                                docstream,
                                response,
                                (err) => err
                                         ? console.trace(err)
                                         : !err
                            )
                        })
                        .catch(err => {
                            err
                                ? console.warn(err)
                                : !err
                            client404Error()
                        })
                        : client404Error()
                   function client404Error () {
                           response.writeHead(404, 'Requested document unavailable at the requested URL.', {
                               'Content-Type': 'text/html',
                               'Access-Control-Allow-Origin': '*',
                               'Transfer-Encoding': 'chunked'
                           })
                           response.write(`<h1 style="
                                text-align: center;
                                color: red;
                                font-family: 'Roboto', serif;
                                border: 2em double red;
                                padding: 5%;
                                ">HTTP/1.1  ERROR  404  REQUESTED DOCUMENT CAN NOT BE LOCATED.</h1>`)
                       }
                })
            })
        
            .listen(this.config.port, this.config.host)
        
    }
}

http_service_edge.http_service()
