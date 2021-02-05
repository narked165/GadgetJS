const { promises: fsAsync } = require('fs')
const { EventEmitter } = require('events')
const { inherits } = require('util')
const { join: joinPath } = require('path')
const { allocDataArrayBuffer } = require('../../lib/allocDataArrayBuffer.js')
let _location = joinPath(__dirname, 'test.txt')
let _flags = { READ_FLAG: 'r', WRITE_FLAG: 'w', WRITE_PLUS_FLAG: 'w+', APPEND_FLAG: 'a', APPEND_PLUS_FLAG: 'a+' }
let _mode = 0o666
let _encoding = 'UTF-8'
let { allFactStream } = require('../../lib/allFactStream')
const READ_STNDRD_OPTNS = [ _location, _flags.READ_FLAG, _mode ]
const WRITE_STNDRD_OPTNS =[ _location, _flags.WRITE_FLAG, _mode ]
const APPEND_STND_OPTS = [_location, _flags.APPEND_FLAG, _mode]

function <<FNAME>>(_location, _flag, _mode, _data, _encoding, callback) {
    fsAsync.<<FNAME>>(_location, _flag, _mode)
        .then((data) => {
            callback(data)
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}
fdatasync(...WRITE_STNDRD_OPTNS, () => {
    console.log('I work but there is no description of my purpose in the Node Docs.  All Crappy guidelines and no documentation makes jack a dull boy...')
} )









function writeFile(_location, _flag, _mode, data, callback) {
    fsAsync.open(_location, _flag, _mode)
        .then(fd => {
            fd.writeFile(data, callback(data, _location))
            console.log(fd)
        })
        .catch(err => err ? console.error(err) : !err)
}

function write(_location, _flags, _mode, _data, _position, _encoding, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.write(_data, _position, _encoding, callback(_data))
            
        })
        .catch(err => err ? console.error(err) : !err)
}


// Done
function appendFile(_location, _flags, _mode, _data, _encoding, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.appendFile(_data, _encoding, callback(_data, _location))
            
        })
        .catch(err => err ? console.error(err) : !err)
}

function readFile(_location, _flags, _mode, _encoding, callback) {
    fsAsync.open(_location, _flags, _mode )
        .then(fd => {
            fd.readFile(_encoding)
                .then(_data => callback(_data, _location ))
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}

function statistics(_location, _flags, _mode, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.stat()
                .then(data => callback(data))
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}

function truncate(_location, _flags, _mode, _len, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.truncate(_len)
                .then(data => callback(data))
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}

function read(_location, _flags, _mode, _buffer, _offset, _len, _position, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.read(_buffer, _offset, _len, _position)
                .then( data  => callback(data))
                .catch(err => {
                    err ? console.error(err) : !err
                })
            
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}

function chmod(_location, _flags, _mode, _nmod, callback) {
    fsAsync.open(_location, _flags, _mode, _nmod)
        .then(fd => {
            fd.chmod(_nmod)
                .then( data  => callback())
                .catch(err => {
                    err ? console.error(err) : !err
                })
            
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}

function chown(_location, _flags, _mode, _noid, callback) {
    fsAsync.open(_location, _flags, _mode, _noid)
        .then(fd => {
            fd.chmod(_noid)
                .then( data  => callback())
                .catch(err => {
                    err ? console.error(err) : !err
                })
            
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}



/*
 write(...WRITE_STNDRD_OPTNS, "spork", 0, 'UTF-8', (data) => {
 console.info(`Wrote ${ data.length }, to the specified file.`)
 })
 
 chown(...WRITE_STNDRD_OPTNS, 0o765, () => {
 
 console.log('done')
 } )
 chmod(...WRITE_STNDRD_OPTNS, 0777, () => {
 console.log('done')
 })
 
 truncate('test.txt', 'w', 0o666, 256, () => {
 console.info('done')
 })

writeFile('./text.txt', 'w', 0o666, 'Cheese, I do Like.', (_data, _location) => {
    console.info(`Wrote ${ _data.length } bytes, to: ${ _location }`)
})
 appendFile(_location, _flags, _mode, _data, _encoding, (_data, _location) => {
 console.log(`Appended ${ _data.length } bytes to: ${ _location }.`)
 })
 
 readFile('test.txt', 'r', 0o666, 'UTF-8', (data, location) => {
 console.log(`DATA-READ: \n\t -> ------- START BLOCK ---------- \n ${ data } \n\n ----------END BLOCK--------- <-\r\n\r\n`)
 })
 
 statistics('test.txt', 'r', 0o666, (data) => {
 console.log(data)
 })
 
 read(_location, 'r', 0o666, Buffer.allocUnsafe(256), 0, 255, 0, (data) => {
 process.stdout.write(`
 [DATA-READ] [BYTE-LENGTH] ${ data.bytesRead } bytes.
 -> ******* DATA-BUFFER-START ****
 ${ data.buffer }
 ********* DATA-BUFFER-END ********* <-
 \n`)
 })
*/