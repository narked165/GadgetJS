
const { EventEmitter } = require('events')
const { inherits } = require('util')
const { join: joinPath, sep } = require('path')
const fs = require('fs')
const os = require('os')
const fswhen_config = require('../../cfg/fswhen_cfg.json')


const { ERROR_EVENT } = fswhen_config.constants
let { default_location, default_handler } = fswhen_config
const {
    chmod_opt,
    access_opt,
    copy_file_opt,
    open_opt,
    open_directory_opt,
    rename_item_opt,
    truncate_item_opt,
    remove_item_opt,
    remove_directory_opt,
    make_directory_opt,
    read_directory_opt,
    read_link_opt,
    symlink_opt,
    list_stats_opt,
    statistics_opt,
    link_opt,
    unlink_opt,
    change_mode_opt,
    l_change_mode_opt,
    l_change_owner_mode,
    change_owner_opt,
    u_times_opt,
    l_u_times_opt,
    real_path_opt,
    make_temp_directory_opt,
    write_file_opt,
    append_file_opt,
    read_file_opt
} = fswhen_config.default_options

const { promises: fsAsync, constants: { W_OK, R_OK, X_OK, COPYFILE_EXCL }} = require('fs')

function FSWhen() {
    this.name = 'fsWhen'
    this.config = fswhen_config
    this.default_location = default_location.pop()
    this.default_handler = default_handler.pop()
    this.timestamp = function() {
        return new Date(new Date().toLocaleTimeString())
    }
    this.locationToURL = function(_location) {
        return new URL(`file:///${ _location }`)
    }
    this.intToOctal = function(id) {
        return [`0o${ (id).toString(8) }`].pop()
    }
    EventEmitter.apply(this)
    return this
}

// Prototype Middleware API


//  [1]  Access checks the file permissions using the READ, WRITE & EXECUTE constants
FSWhen.prototype.access = function(_location, callback){
    fsAsync.access(_location, R_OK | W_OK)
        .then(callback(true))
        .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
}

// [2]   CopyFileSafe attempts to copy the file, Emitting an error event if the file exists (No Overwrite)
FSWhen.prototype.copyFileSafe = function(_origin, _destination, callback) {
    fsAsync.copyFile(_origin, _destination, COPYFILE_EXCL, callback)
        .then(callback(true))
        .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
}

//  [3]  CopyFileUnsafe attempts to copy the file, Overwrites file if it exists.
FSWhen.prototype.copyFileUnsafe = function(_origin, _destination, callback) {
    fsAsync.copyFile(_origin, _destination)
        .then(callback(true))
        .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
       
}

// [4]  Opens the file and returns the FD, (or null on error) to the callback, then closes the FD  after the read operation completes.
FSWhen.prototype.openRead = function(_location, _flags, _mode, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then((fd) => { callback(true, fd); return fd })
        .finally(fd => fd ? fd.close() : !fd)
        .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false, null)) : !err)
}

// [5]  Opens the directory and returns the FD, (or null on error) to the callback, then closes the FD after the operation completes.
FSWhen.prototype.openDirectory = function(_location, _flags, _mode, _handler, callback) {
    fsAsync.opendir(_location, _flags, _mode)
        .then((fd) => { callback(true, fd); return fd })
        .finally(fd => fd ? fd.close() : !fd)
        .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false, null)) : !err)
}

//  [6] FSWhen checks if item is accessible and then, attempts to rename the target, or throws an Error Event.
FSWhen.prototype.renameItem = function(_handleInitial, _handleFinal, verify, callback) {
    this.access(_handleInitial, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
            fsAsync.rename(_handleInitial, _handleFinal)
                .then(callback(true))
                .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
        })
}


//  [7]  Truncate opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.truncate = function(_location, _flags, _mode, _len, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.truncate(_len)
                .then(data => callback(data))
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}

// [8]  removes item recursively but throws error if the target does not exist.
FSWhen.prototype.removeItemRecurseSafe = function() {
    this.access(location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        let _locationURL = this.locationToURL(_location)
        fsAsync.rm(_locationURL,{ force: false, maxRetries: 0, recursive: true, retryDelay: 0 })
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

// [9]  removes item recursively and ignores errors thrown
FSWhen.prototype.removeItemRecuseUnsafe = function() {
    this.access(location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.rm(_location, true, 1, true)
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

//  [10]  Removes an item, ignoring errors but does not remove recursive items
FSWhen.prototype.removeItemUnsafe = function(_location, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : !err
        let _locationURL = this.locationToURL(_location)
        fsAsync.rm(_locationURL ,{ force:  true, maxRetries: 1, recursive: false, retryDelay: 300 })
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

//  [11]  Removes items without recurrsion and errors when a target is inaccessable
FSWhen.prototype.removeItemSafe = function(_location, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(!err)
        let _locationURL = this.locationToURL(_location)
        fsAsync.rm(_locationURL, { force: false, maxRetries: 0, recursive: false, retryDelay: 0 })
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

//  [12]  Uses access to verify the location exists before removal
FSWhen.prototype.removeDirectory = function(_location, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.rmdir(_location)
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

//  [13[  Checks if folder exists then attempts to create the directory.  Error if the folder exists.
FSWhen.prototype.makeDirectory = function(_location, verify, callback) {
    fs.access(_location, (err) => {
       typeof(err) === 'undefined'
            ?  this.emit(ERROR_EVENT,  new Error(`Directory ${ _location }, already exists... Can not continue.`), verify(false))
            :  fsAsync.mkdir(_location)
                    .then(callback(true))
                    .catch(err => err.code !== "ENOENT" ? this.emit(ERROR_EVENT, err, callback(false)) : callback(err === ENOENT))
        
    })
}

// [14]  ]hecks access to the directory r/w, then attempts to read the directory contents; Error if the directory is inaccessible.
FSWhen.prototype.readDirectory = function(_location, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.readdir(_location, { withFileTypes: true })
            .then(dir => callback(true, dir))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

// [15]  checks for access then attempts to read the referring target.  Error if the link or target does not exist.
FSWhen.prototype.readlink = function(_location, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.readlink(_location, { withFileTypes: true })
            .then(dir => callback(true, dir))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

// [16]   Uses Access to check that referrng location exsists, then attempts to create a symbolic link
// Error if the link exists, or the referring target does not.
FSWhen.prototype.symlink = function(_location, _linkLocation, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.symlink(_location, _linkLocation)
            .then(() => callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}


//  [17]  Stats opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.stats = function(_location, _flags, _mode, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.stat()
                .then(data => callback(data))
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)
}

//  [18]  Link uses access to verify r/w and calls fs-promises-link inside the callback.
FSWhen.prototype.link = function(_locationInitial, _locationFinal, verify, callback) {
    this.access(_locationInitial, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.link(_locationInitial, _locationFinal)
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

// [19]  Uses access r/w to verify the file before removing eles emits an error event
FSWhen.prototype.unlink = function(_location, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.unlink(_location)
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

//  [21]  checks fike exists with access then attempts to change the mode.  Error if the target is not accesible.
FSWhen.prototype.lchmod = function(_location, _mode, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.lchmod(_location, _mode)
            .then(data => callback(true, data))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

// [22]  checks file existance with access r/w then attempts to set the uid & gid of the target.
// Error of the uid or gid does not have prerequisite authority or target does not exist.
FSWhen.prototype.lchown = function(_location, _ownerId, _groupId, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        let _ownerIdOctal = this.intToOctal(_ownerId)
        let _groupIdOctal = this.intToOctal(_groupId)
        fsAsync.lchown(_location, _ownerIdOctal, _groupIdOctal)
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}

//  [23]  utimes uses access r/w to check file access then attempts to change that files timestamp.
FSWhen.prototype.utimes = function(_location, _atime, _mtime, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.utimes(_location, _atime, _mtime)
            .then(callback(true))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
    
}

//  [24]  Checks if the file exists then attempts to change the timestamp, errors if the file doesn't exist.
FSWhen.prototype.lutimes = function(_location, _atime, _mtime, verify, callback) {
        this.access(_location, (acc, err) => {
            err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
            fsAsync.utimes(_location, _atime, _mtime)
                .then(callback(true))
                .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
        })
}

//  [25]  uses access to check that the file exists then resolves the absolute path, error if it doesnt exist.
FSWhen.prototype.realPath = function(_location, verify, callback) {
    this.access(_location, (acc, err) => {
        err ? this.emit(ERROR_EVENT, err, callback(false)) : verify(true)
        fsAsync.realpath(_location)
            .then(data => callback(true, data))
            .catch(err => err ? this.emit(ERROR_EVENT, err, callback(false)) : !err)
    })
}


// [26]  checks if directory exists then attempts to make a directotry with the prefix, errors  if the tempdir exists
FSWhen.prototype.mkdtemp= function(_prefix, verify, callback) {
    let TEMP_DIR = os.tmpdir(),
    _location = `${ TEMP_DIR }${ _prefix }${ sep }`
    fs.access(_location, (err) => {
        typeof(err) === 'undefined'
        ?  this.emit(ERROR_EVENT,  new Error(`Directory ${ _location }, already exists... Can not continue.`), verify(false))
        :  fsAsync.mkdir(_location)
            .then(dir => callback(dir, true))
            .catch(err => err.code !== "ENOENT" ? this.emit(ERROR_EVENT, err, callback(false)) : callback(err === ENOENT))
        
    })
    
}


//  [27]   Write File opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.writeFile = function(_location, _flag, _mode, data, callback) {
    fsAsync.open(_location, _flag, _mode)
        .then(fd => {
            fd.writeFile(data, callback(data, _location))
            console.log(fd)
        })
        .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
},


//  [28]  Append File opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.appendFile = function(_location, _flags, _mode, _data, _encoding, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.appendFile(_data, _encoding, callback(_data, _location))
            
        })
        .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
}

//  [29]  Read File opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.readFile = function(_location, _flags, _mode, _encoding, callback) {
    fsAsync.open(_location, _flags, _mode )
        .then(fd => {
            fd.readFile(_encoding)
                .then(_data => callback(_data, _location ))
            fd.close()
        })
        .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
}

//  [30]  Read opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.read = function(_location, _flags, _mode, _buffer, _offset, _len, _position, callback) {
    fsAsync.open(_location, _flags, _mode)
        .then(fd => {
            fd.read(_buffer, _offset, _len, _position)
                .then( data  => callback(data))
                .catch(err => {
                    err ? this.emit(ERROR_EVENT, err) : !err
                })
            
            fd.close()
        })
        .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
}

//  [31]  Chmod opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.chmod = function(_location, _flags, _mode, _nmod, callback) {
    fsAsync.open(_location, _flags, _mode, _nmod)
        .then(fd => {
            fd.chmod(_nmod)
                .then( data  => callback())
                .catch(err => {
                    err ? this.emit(ERROR_EVENT, err): !err
                })
            
            fd.close()
        })
        .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
}
//  [32]  Chown opens FileHandle and uses the async ~ fsPromises API
FSWhen.prototype.chown = function(_location, _flags, _mode, _noid, callback) {
    fsAsync.open(_location, _flags, _mode, _noid)
        .then(fd => {
            fd.chmod(_noid)
                .then( data  => callback())
                .catch(err => {
                    err ? this.emit(ERROR_EVENT, err) : !err
                })
            
            fd.close()
        })
        .catch(err => err ? console.error(err) : !err)

}

inherits(FSWhen, EventEmitter)

const fsWhen = new FSWhen()
fsWhen.on(ERROR_EVENT, err => {
    console.warn(err)
    console.trace(err)
})

module.exports = { fsWhen }

