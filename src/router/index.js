const { createWriteStream: wStream, createReadStream: rStream,  promises: fsAsync } = require('fs')
const { join: joinPath, parse: parsePath, sep } = require('path')
const { inherits } = require('util')
const { EventEmitter } = require('events')
const { duplex, Transform, pipeline } = require('stream')
const http = require('http')
const assert = require('assert')
const { parse: qsParser } = require('querystring')
const { pathToFileURL: path2file, fileURLToPath: file2path } = require('url')

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const { GadgetJs } = require('../../app.js')
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const app = new GadgetJs()
//  Object Router [ Type - EventEmitter ] Prototype Constructor
const Router = function(request, response) {
    this.name = '_router'
    this.request = request
    this.response = response
    this.$DOCPATH = joinPath(__dirname, '..', '..', 'doc')
    EventEmitter.apply(this)
    return this
}

Router.prototype.route = function() {
   let CLIENT_REQUEST_PATH =  joinPath(`${ this.$DOCPATH }${ this.request.url }`)
    return Buffer.from(CLIENT_REQUEST_PATH)
}

Router.prototype.docStream = function(docpath) {
    let stream
    app.emit('NEW-DOCPATH', docpath)
    return new Promise((resolve, reject) => {
        fsAsync.open(docpath, 'r', 0o666)
            .then(fd => {
                typeof(docpath) === 'undefined' ||
                fd ? fd.close() && resolve(docpath) : !fd
            })
            .catch(err => {
                err ? reject(err) : !err
            })
        
    })
}

Router.prototype.routeResponse = function(requestUrl) {
    this.requestUrl = requestUrl
    this.binArray = []
    this.path = parsePath(requestUrl)
    
    // Creates a binary enumeration signature from a cascading table of bitwise pathstring attributes
    this.routeKeys = {
        
        // * Mime-Extension not eq to undefined
        extNotUndef(value) {
            let { ext } = parsePath(value)
            this.binArray.push(typeof ( ext ) !== 'undefined' | 0)
        },
        
        // * PATH name not eq to 'undefined
        nameNotUndef(value) {
            let { name } = parsePath(value)
            this.binArray.push(typeof ( name ) !== 'undefined' | 0)
        },
        
        //
        baseNotUndef(value) {
            let { base } = parsePath(value)
            this.binArray.push(typeof ( base ) !== 'undefined' | 0)
        },
        dirIsRoot(value) {
            let { dir } = parsePath(value)
            this.binArray.push(dir === '/' | 0)
        },
        urlHasADot(value) {
            this.binArray.push(value.includes('.') | 0)
        },
        urlHasAEnumDelim(value) {
            this.binArray.push(value.includes(':') | 0)
        },
        urlHasRootLength(value) {
            this.binArray.push(value.length < 2 | 0)
        },
        urlHasQueryParams(value) {
            this.binArray.push(value.includes('?') | 0)
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
    
    // Iterate the array and call each, pushing a 1/0 into the array.
    this.parseUrlDomain = function() {
        return Object.values(this.routeKeys)
            .forEach(k => k.call(this, this.requestUrl))
    }
    
    this.routeEnumerator = function() {
       return  parseInt( parseInt(this.binArray.join(''), 2))
    }
    
    this.routeType = function() {
        return this.routingTable[parseInt( parseInt(this.binArray.join(''), 2) )]
    }
    return {
        routeEnumerator: this.routeEnumerator(),
        routeType: this.routeType
    }
}
inherits(Router, EventEmitter)

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Router.requestParser.prototype.urlFilePath = function(_location) {
    return fileURLToPath(_location)
}

Router.requestParser.prototype.filePathUrl = function() {
    let proxyPath = joinPath(this.$DOCUMENT_ROOT, this.FQDN_URL.pathname)
    return pathToFileURL(proxyPath).href
}
Router.requestParser.prototype.fileStream = function() {
    return new Readable({
        readableObjectMode: true,
        read() {
        
        }
    }).from
}

const test0 = new Router.requestParser('/moo0.jpeg')

module.exports = { Router }