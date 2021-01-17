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

inherits(Router, EventEmitter)

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = { Router }