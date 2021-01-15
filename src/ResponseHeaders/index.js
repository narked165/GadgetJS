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
        _SET_INITIAL_DEFAULT() {
            let keys = ["Status-Code", "Content-Type", "Connection", "Transfer-Encoding", "Access-Control-Allow-Origin"]
            keys.forEach(k => this._RESPONSE_HEADERS_[k] = this._RESPONSE_HEADERS_[k] || this.RESPONSE_HEADERS_DEFAULT[k])
        },
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
    this.setEvent(k, this.headers[k])
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
inherits(ResponseHeaders, EventEmitter)


//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = { ResponseHeaders }