const { join: joinPath, parse: parsePath, sep: pathDelim } = require('path')
const { promises: fsAsync } = require('fs')
const { pathToFileURL, fileURLToPath  } = require('url')
const { Readable, pipeline } = require('stream')
const { convertExt2ContentType } = require('./convertExt2ContentType')
function routes() {
    let Routes = {
        set $DOCPATH(value) {
            this._docpath = value.toString()
        },
        get $DOCPATH() {
          return this._docpath || false
        },
        _routes: {},
        add(handle) {
            this._routes[ handle ] = this._routes[ handle ] || []
            this._routes[ handle ].push(joinPath(this.$DOCPATH, handle, 'index.html'))
        },
    
        query(handle) {
            return handle in this._routes
        },
    
        select(handle) {
            let err, result,
            
                hasRoute = (handle) => {
                    err = null
                    result = this._routes[ handle ][0]
                    return [err, result]
                },
                hasError = (handle) => {
                    err = new Error(`[!] [ROUTE-ERROR] [${ new Date().toLocaleTimeString() }] :: ROUTE: ${ handle }, not registered.\n`)
                    result = null
                    return [ err, result ]
                }
            return handle in this._routes ? hasRoute(handle) : hasError(handle)
            
        },
        catalog(_location, callback) {
            try {
              fsAsync.readdir(_location, { withFileTypes: true})
                    .then(dir => {
                        return dir.filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('_'))
                    })
                    .then(dirs => {
                        dirs.forEach(dirent => this.add(dirent.name))
                    })
                  .then(() => {
                      callback(this._routes)
                  })
                    .catch(err => err ? console.error(err) : ! err)
            }
            catch(err) {
                err ? console.error(err) : !err
            }
           
        }
    }
        Routes.$DOCPATH = joinPath(__dirname,  '..', 'doc')
      
    return new Promise((resolve, reject) => {
        
        Routes.catalog(Routes.$DOCPATH, ((routes) => {
           Object.keys(routes).length > -1 ? resolve(Routes) : reject(`No Routes.`)
        }))
        
    })
}
    
    
routes().then((_routes, routes) => {
    console.log([err, result] = _routes.select('default'))
})

function routeResponse(requestUrl) {
    this.requestUrl = requestUrl
    this.binArray = []
    this.path= parsePath(requestUrl)
    
    // Creates a binary enumeration signature from a cascading table of bitwise pathstring attributes
    this.routeKeys= {
      
        extNotUndef(value) {
            let {ext} = parsePath(value)
            this.binArray.push(typeof(ext) !== 'undefined' |0)
        },
        nameNotUndef(value) {
            let { name } = parsePath(value)
            this.binArray.push(typeof(name) !== 'undefined' |0)
        },
        baseNotUndef(value) {
            let { base } = parsePath(value)
            this.binArray.push(typeof(base) !== 'undefined' |0)
        },
        dirIsRoot(value) {
            let { dir } = parsePath(value)
            this.binArray.push(dir === '/' |0)
        },
        urlHasADot(value) {
            this.binArray.push(value.includes('.') |0)
        },
        urlHasAEnumDelim(value) {
            this.binArray.push(value.includes(':') |0)
        },
        urlHasRootLength(value) {
            this.binArray.push(value.length < 2 |0)
        },
        urlHasQueryParams(value) {
            this.binArray.push(value.includes('?') |0)
        }
    }
    // Translates bitwise enumeration signatures -- @TODO replace values with routing function
    this.routingTable = {
        240: 'route',
        232: 'path',
        228: 'enumRoute',
        225: 'queryParam',
        242: 'root'
    }
    this.complete = function set (value) {
        this.responseReady = value
    }
    
    this.complete = function get () {
        return this.responseReady
    }
    this.routeKeys.path = requestUrl
    let response = new Promise((resolve, reject) => {
      try {
          let done = Object.values(this.routeKeys).forEach(k => k.call(this, this.requestUrl)) |true || false
          done && resolve({complete: true})
      }
      catch(err) {
        err !== null ? !err : !err
      }
      
      })
   
    
   while(!this.complete) {
        response
            .then(({complete}) => { this.complete=complete} )
            .catch(err => err ? console.warn(err) : !err)
   }
   return {
        routeEnumerator: parseInt( parseInt(this.binArray.join(''), 2) ),
       routeType: this.routingTable[parseInt( parseInt(this.binArray.join(''), 2) )]
   }
}



//  Tests ------------------>
const route = "/default"
const path = "/default/index.html"
const enumRoute = "/api/users:123456"
const queryParamPath = "/api/users?name=george"
const root = '/'

const tests = [
    new routeResponse(route).routeType,
    new routeResponse(path).routeType,
    new routeResponse(enumRoute).routeType,
    new routeResponse(queryParamPath).routeType,
    new routeResponse(root).routeType
]

tests.forEach(test => console.log(test))

function requestParser(FQDN_URL) {
    this.FQDN_URL = new URL(FQDN_URL)
    this.$DOCUMENT_ROOT = joinPath(__dirname, '..', 'doc')
    return this
}

requestParser.prototype.urlFilePath = function(_location) {
    return fileURLToPath(_location)
}

requestParser.prototype.filePathUrl = function() {
   let proxyPath = joinPath(this.$DOCUMENT_ROOT, this.FQDN_URL.pathname)
    return pathToFileURL(proxyPath).href
}
requestParser.prototype.fileStream = function() {
    return new Readable({
        readableObjectMode: true,
        read() {
        
        }
    }).from
}

let testUrl = new URL('https://sporkmorky.org:9666/api/clients/desktop23471/config.cfg?hostAddress').href

let testRP = new requestParser(testUrl)

let filePath = testRP.filePathUrl()
let pathFile = testRP.urlFilePath(filePath)

console.log(filePath)
console.log(pathFile)

async function fileStreamState(_locationURL) {
    let response = [], fileBuffer, fileHandle
    try {
        fileHandle =  await fsAsync.open(_locationURL, 'r', 0o666)
        fileBuffer = await fileHandle.readFile()
        response[1] = await Buffer.from(fileBuffer)
        response[0] = null
        return response
    }
    catch(err) {
        caughtError = err.code === 'ENOENT'
            ? response[0] = `Unresolved file URL: ${ _locationURL }.\n The specified file URL is either inaccessible, or does not exist on this server.\n`
            : response[0] = new Error(err)
        response[1] = null
        return response
    }
}
function convert6To4(_address) {
    console.log(_address)
    return _address.toString() === '::1' ? 'localhost' : _address
}

const simsvr = require('http').createServer()
simsvr.on('request', (request, response) => {
    let requestUrl = new URL(`http://${ convert6To4(request.socket.localPort) }:${request.socket.localPort }${ request.url }`)
    let parser = new requestParser(requestUrl)
    let clientOrigin = new URL(`http://${ request.socket.remoteAddress }:${ request.socket.localPort }`)
    console.log(parser)
    let urlLocation = parser.filePathUrl()
    let fileLocation = parser.urlFilePath(urlLocation)
    let contentType = convertExt2ContentType(parsePath(requestUrl.href).ext)
    let fileStreamStatus = fileStreamState(fileLocation)
    fileStreamStatus
        .then(( [err, data] ) => {
            Buffer.isBuffer(data) === 'object'
                ? respondWith(200, `<h1>${ data }</h1>`)
                : err.code = '404' && !data
                    ? respondWith(404, `<h1>ERROR: 404</h1><span>&#42297;</span><br /><hr /><h3>${ err }</h3>`)
                    : Buffer.isBuffer(data)
                        ? respondWith(200, `<h1>${ data }</h1>`)
                        : respondWith(err.code, `<h1>ERROR: ${ JSON.stringify(err) }</h1>`)
        
        })
        .catch(err => err ? console.warn(err) : !err)
    
    function respondWith(statusCode, data) {
        response.writeHead(statusCode, {
            'Transfer-Encoding': 'chunked',
            'Connection': 'Keep-alive',
            'Access-Control-Allow-Origin': clientOrigin,
            'contentType': contentType
        })
    
        let dataStream = new Readable.from(data)
        pipeline(
            dataStream,
            response,
            (err) => { err ? console.warn(err) : !err }
        )
    }
})
simsvr.on('listening', () => console.info(`Server online at: http://localhost:9000/`))
simsvr.on('error', err  => err ?  console.warn(err) : console.info('Done...'))
simsvr.listen(9003, 'localhost')