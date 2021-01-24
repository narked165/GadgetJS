const { join: joinPath, parse: parsePath } = require('path')
const { promises: fsAsync } = require('fs')

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