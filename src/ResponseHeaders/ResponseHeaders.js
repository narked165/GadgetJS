const { createWriteStream: wStream, createReadStream: rStream,  promises: fsAsync } = require('fs')
const { join: joinPath, parse: parsePath, sep } = require('path')
const { inherits } = require('util')
const { EventEmitter } = require('events')
const { duplex, Transform, pipeline } = require('stream')
const http = require('http')
const assert = require('assert')
const { parse: qsParser } = require('querystring')
const { pathToFileURL: path2file, fileURLToPath: file2path } = require('url')
const RESPONSE_HEADERS_DEFAULT_SET = require('../../cfg/response_headers.json')
const { convertExt2ContentType } = require('../../lib/convertExt2ContentType')
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//  Object Response Stream [ Type - EventEmitter ] Prototype Constructor
function ResponseHeaders(request, response) {
    this.name = '_responseHeaders',
    this.request = request
    this.response = response
    this.defaults = RESPONSE_HEADERS_DEFAULT_SET
    this.headers = {
        _RESPONSE_HEADERS_:{},
        
        set contentType(value){
            this._RESPONSE_HEADERS_["Content-Type"] = value
            return [this._RESPONSE_HEADERS_["Content-Type"] === value]
        },
        
        get contentType() {
            return this._RESPONSE_HEADERS_["Content-Type"]
        },
        
        set statusCode(value){
            this._RESPONSE_HEADERS_["Status-Code"] = value
            return [this._RESPONSE_HEADERS_["Status-Code"] === value]
        },
        
        get statusCode() {
            return this._RESPONSE_HEADERS_["Status-Code"]
            
        },
        set transferEncoding(value){
            this._RESPONSE_HEADERS_["Transfer-Encoding"] = value
            return [this._RESPONSE_HEADERS_["Transfer-Encoding"] === value]
        },
        
        get transferEncoding() {
            return this._RESPONSE_HEADERS_["Transfer-Encoding"]
            
        },
        set connectionType(value){
            this._RESPONSE_HEADERS_["Connection"] = value
            return [this._RESPONSE_HEADERS_["Connection"] === value]
        },
        
        get connectionType() {
            return this._RESPONSE_HEADERS_["Connection"]
            
        },
        set accessControlAllowOrigin(value){
            this._RESPONSE_HEADERS_["Access-Control-Allow-Origin"] = value
            return [this._RESPONSE_HEADERS_["Access-Control-Allow-Origin"] === value]
        },
        
        get accessControlAllowOrigin() {
            return this._RESPONSE_HEADERS_["Access-Control-Allow-Origin"]
        },
    }
    
    EventEmitter.apply(this)
    return this
}
ResponseHeaders.prototype.assign = function (k, v)  {
    this.headers[k] = v
    return this.headers[k] === v
}

ResponseHeaders.prototype.buildHeaders = function() {
    
    return {
        statusCode: this.headers.statusCode,
        headers: {
            "Content-Type": this.headers.contentType,
            "Transfer-Encoding": this.headers.transferEncoding,
            "Connection": this.headers.connectionType,
            "Access-Control-Allow-Origin": this.headers.accessControlAllowOrigin
        }
    }
}

//  Sets the common response headers.  ie. Transfer Encoding, connection
ResponseHeaders.prototype.setCommonDefaults = function() {
    try {
        let keys = [ "connection", "transferEncoding" ]
        keys.forEach(k => this.assign(k, this.defaults[ k ]))
        return true
    }
    
    catch (err) {
        !err || console.warn(err)
        return err ? false : !err
    }
}

ResponseHeaders.prototype.setCORSOrigin = function() {
    try {
        let client = new  URL(`http://${ this.request.socket.localAddress }:${ this.request.socket.localPort }`)
        this.assign('accessControlAllowOrigin', client.origin)
        return true
    }
    
    catch (err) {
        !err || console.warn(err)
        return  err ? false : !err
    }
}

ResponseHeaders.prototype.setContentType = function() {
    try {
        let { ext } = parsePath(this.request.url)
        this.assign('contentType', convertExt2ContentType(ext))
        return true
    }
    
    catch(err) {
        !err || console.warn(err)
        return  err ? false : !err
    }
}

ResponseHeaders.prototype.setStatus = function() {
    try {
        this.assign('statusCode', 200)
        return true
    }
    
    catch(err) {
        !err || console.warn(err)
        return  err ? false : ! err
    }
}
inherits(ResponseHeaders, EventEmitter)


//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = { ResponseHeaders }