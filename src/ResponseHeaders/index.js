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

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//  Object Response Stream [ Type - EventEmitter ] Prototype Constructor
const ResponseHeaders = function(n, proxyEvents) {
    this.name = n
    this.setEvent = proxyEvents
    this.headers = {
        _RESPONSE_HEADERS_:{},
        RESPONSE_HEADERS_DEFAULT: require('../../cfg/response_headers.json'),
        set contentType(value){
            this._RESPONSE_HEADERS_["Content-Type"] = value
            return [this._RESPONSE_HEADERS_["Content-Type"] === value]
        },
        
        get contentType() {
            return typeof this._RESPONSE_HEADERS_["Content-Type"] !== 'undefined'
                ? this._RESPONSE_HEADERS_["Content-Type"]
                : this.RESPONSE_HEADERS_DEFAULT["Content-Type"]
        },
        
        set statusCode(value){
            this._RESPONSE_HEADERS_["Status-Code"] = value
            return [this._RESPONSE_HEADERS_["Status-Code"] === value]
        },
    
        get statusCode() {
            return typeof this._RESPONSE_HEADERS_["Status-Code"] !== 'undefined'
                   ? this._RESPONSE_HEADERS_["Status-Code"]
                   : this.RESPONSE_HEADERS_DEFAULT["Status-Code"]
        },
        set transferEncoding(value){
            this._RESPONSE_HEADERS_["Transfer-Encoding"] = value
            return [this._RESPONSE_HEADERS_["Transfer-Encoding"] === value]
        },
    
        get transferEncoding() {
            return typeof this._RESPONSE_HEADERS_["Transfer-Encoding"] !== 'undefined'
                   ? this._RESPONSE_HEADERS_["Transfer-Encoding"]
                   : this.RESPONSE_HEADERS_DEFAULT["Transfer-Encoding"]
        },
        set connectionType(value){
            this._RESPONSE_HEADERS_["Connection"] = value
            return [this._RESPONSE_HEADERS_["Connection"] === value]
        },
    
        get connectionType() {
            return typeof this._RESPONSE_HEADERS_["Connection"] !== 'undefined'
                   ? this._RESPONSE_HEADERS_["Connection"]
                   : this.RESPONSE_HEADERS_DEFAULT["Connection"]
        },
        set accessControlAllowOrigin(value){
            this._RESPONSE_HEADERS_["Access-Control-Allow-Origin"] = value
            return [this._RESPONSE_HEADERS_["Access-Control-Allow-Origin"] === value]
        },
    
        get accessControlAllowOrigin() {
            return typeof this._RESPONSE_HEADERS_["Access-Control-Allow-Origin"] !== 'undefined'
                   ? this._RESPONSE_HEADERS_["Access-Control-Allow-Origin"]
                   : this.RESPONSE_HEADERS_DEFAULT["Access-Control-Allow-Origin"]
        },
    }
    
    EventEmitter.apply(this)
    return this
}
ResponseHeaders.prototype.assign = function (k, v)  {
    
    let headerPair = !this.headers[k] ?
              !v === this.headers[k] || v !== undefined && k in this.headers
              ? this.headers[k] = v : ![!k || !v] : [k,v]
    this.setEvent(k,v)
    return headerPair
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
inherits(ResponseHeaders, EventEmitter)


//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = { ResponseHeaders }