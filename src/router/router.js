const {  EventEmitter } = require('events')
const { inherits } = require('util')
const { join: joinPath, parse: parsePath, sep } = require('path')
const { promises: fsAsync } = require('fs')
const routing_service_config = require('../../cfg/router_svc_cfg.json')
const { convertExt2ContentType } = require('../../lib/convertExt2ContentType')
const Utilities = {
    _buildPath(_pathArray) {
        return joinPath(__dirname, ..._pathArray)
    },
    _convertContentType(_ext) {
        return convertExt2ContentType(_ext)
    }
}

function Router(_request, _response) {
    this.name = '_router'
    this.request = _request
    this.response = _response
    this.config = routing_service_config
    this.$DOCROOT = Utilities._buildPath(routing_service_config.$DOCROOT)
    this.$APPROOT = Utilities._buildPath(routing_service_config.$APPROOT)
    EventEmitter.apply(this)
    return this
}

inherits(Router, EventEmitter)

Router.prototype.routeRequest = function() {
  
            return new Promise((resolve, reject) => {
                try {
                    
                    resolve(joinPath(this.$DOCROOT, this.request.url))
                
                }
        
                catch ( err ) {
                
                    err ? reject(err) : !err
                
                }
        
        
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
    response
        .then(({complete}) => { this.complete=complete} )
        .catch(err => err ? console.warn(err) : !err)
    
    return {
        routeEnumerator: this.routeEnumerator(),
        routeType: this.routeType
    }
    return {
        routeEnumerator: this.routeEnumerator(),
        routeType: this.routeType
    }
    
}

module.exports = { Router }