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
const Router = function(n = '_router', request, response, ...proxyEmitters) {
    let [ errEmit, infoEmit, rddRsp, clErrRsp ] = proxyEmitters
    this.name = n
    this.errorEmitter = errEmit
    this.infoEmitter = infoEmit
    this.readyResponseEmitter = rddRsp
    this.clientErrorResponse = clErrRsp
    EventEmitter.apply(this)
    return this
}

inherits(Router, EventEmitter)

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = { Router }