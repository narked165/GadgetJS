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

//  Object Router [ Type - EventEmitter ] Prototype Constructor
const Router = function(n = '_router', $DOCPATH, request, response, ...proxyEmitters) {
    this.name = n
    this.request = request
    this.response = response
    this.$DOCPATH = joinPath(__dirname, '..', '..', 'doc')
    let [ errEmit, infoEmit, rddRsp, clErrRsp ] = proxyEmitters
    this.errorEmitter = errEmit
    this.infoEmitter = infoEmit
    this.readyResponseEmitter = rddRsp
    this.clientErrorResponse = clErrRsp
    EventEmitter.apply(this)
    return this
}

Router.prototype.route = function() {
    return joinPath(`${ this.$DOCPATH }${ (this.request).url }`)
}

Router.prototype.docStream = function(docpath) {
    let stream
    return new Promise((resolve, reject) => {
        fsAsync.open(docpath, 'r', 0o666, { autoClose: true })
            .then(fd => {
                typeof(docpath) === 'undefined' ||
                fd ? fd.close() && resolve(rStream(docpath)) : !fd
            })
            .catch(err => {
                err ? reject(err) : !err
            })
    })
}

inherits(Router, EventEmitter)

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = { Router }