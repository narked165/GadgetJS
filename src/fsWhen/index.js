const { promises: fsAsync, constants: { R_OK, W_OK, X_OK } } = require('fs')
const { EventEmitter } = require('events')
const { inherits } = require('util')
const { join: joinPath } = require('path')
const fswhen_config = require('../../cfg/fswhen_cfg.json')

const { ERROR_EVENT  } = fswhen_config.constants
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



function FSWhen() {
    this.name = 'fsWhen'
    this.config = fswhen_config
    this.default_location = default_location.pop()
    this.default_handler = default_handler.pop()
    EventEmitter.apply(this)
}


FSWhen.prototype = {

    access(_location = this.default_location, _options = access_opt, _handler = this.default_handler) {
        fsAsync.access(_location, ..._options)
            .then(() => _handler())
            .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
    },
    
    
    coppyFile(_location = this.default_location, _options = copy_file_opt, _handler = this.default_handle) {
        fsAsync.copyFile(_origin, _destination, ..._options)
            .then(() => _handler())
            .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
    },
    
    
    open(_location = this.default_location.pop(), _options = open_opt, _handler) {
        fsAsync.open(_location, ..._options)
            .then((fd) => { _handler(fd); return fd })
            .finally(fd => fd ? fd.close() : !fd)
        .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
    },
    
    
    openDirectory(_location = this.default_location, _options = open_directory_opt, _handler = this.default_handler) {
        fsAsync.opendir(_location, _options)
            .then((fd) => { _handler(fd); return fd })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT, err) : !err)
    },
    
    
    renameItem(_location1 = this.default_location, _location2 = this.default_location,  _options = rename_item_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.rename(_location1, _location2, ..._options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
       
    },
  
    
    truncateItem(_location = this.default_location, _options = truncate_item_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.truncate(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    removeItem(_location = this.default_location, _options = remove_item_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.rm(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    removeDirectory(_location = this.default_location, _options = remove_directory_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.rmdir(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
        fsAsync.rmdir(_location, _options)
    },
    
    
    makeDirectory(_location = this.default_location, _options = make_directory_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.mkdir(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    readDirectory(_location = this.default_location, _options = read_directory_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.readdir(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    readLink(_location = this.default_location, _options = read_link_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.readlink(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    symLink(_location = this.default_location, _options = symlink_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.symlink(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    listStats(_location = this.default_location, _options = list_stats_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.lstat(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
        fsAsync.lstat(_location, _options)
    },
    
    
    statistics(_location = this.default_location, _options = statistics_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.stat(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    link(_location = this.default_location, _options = link_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.link(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    unlink(_location = this.default_location, _options = unlink_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.unlink(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    changeMode(_location = this.default_location, _options = change_mode_opt, handler = this.default_handler) {
        
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.truncate(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
        fsAsync.chmod(_location, _options)
    },
    
    
    lChangeMode(_location = this.default_location, _options = l_change_mode_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.lchmod(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    
    lChangeOwner(_location = this.default_location, _options = l_change_owner_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.lchown(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    
    changeOwner(_location = this.default_location, _options = change_owner_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.chown(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
        fsAsync.chown(_location, _options)
    },
    
    
    
    uTimes(_location = this.default_location, _options = u_times_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.utimes(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    lUTimes(_location = this.default_location, _options = l_u_times_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.lutimes(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    
    realPath(_location = this.default_location, _options = real_path_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.realpath(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
        
    },
    
    
    
    makeTempDirectory(_location = this.default_location, _options = make_temp_directory_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fsAsync.mkdtemp(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    
    writeFile(_location = this.default_location, _options = write_file_opt, _handler = this.default_handler) {
        fsAsync.open(_location1, ..._options)
            .then((fd) => {
                fd.writeFile(_location, _options)
                    .then(() => _handler());
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
       
    },
    
    
    
    appendFile(_location = this.default_location.pop(), _options = append_file_opt, data, _handler) {
        fsAsync.open(_location, ..._options)
            .then(fd => {
                fd.appendfile(data, _handler(data)).catch(err => console.trace(err))
                return fd
            })
            .finally(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
    },
    
    
    
    readFile(_location = this.default_location, _options = read_file_opt, data, _handler = this.default_handler.pop()) {
        fsAsync.open(_location, ..._options)
            .then(fd => {
                fd.readFile(data).then((data) => _handler(data));
                return fd
            })
            .then(fd => fd ? fd.close() : !fd)
            .catch(err => err ? this.emit(ERROR_EVENT) : !err)
      fsAsync.readFile(_location, _options)
    }
}

inherits(FSWhen, EventEmitter)

const fsWhen = new FSWhen()
fsWhen.on('ERROR_EVENT', err => {
    console.warn(err)
    console.trace(err)
})
fsWhen.open('./test.txt', ['a+', 0o666], (fd) => {
    console.log(fd)
})
fsWhen.access(__dirname + '/test.txt', [R_OK, W_OK, X_OK], () => {
    console.log('Access Granted!')
})
fsWhen.readFile('./src/test.txt', ['r', 0o666], (data) => {
    console.log(data)
})

let textExample = " I am a test."
let path1 = joinPath(__dirname, 'test.txt')
let path2 = joinPath(__dirname, 'test.txt')

module.exports = { fsWhen: new FSWhen() }
/* TESTS
fsWhen.renamedItem(path1, path2, ['r'], () => {
    console.log('done')
})

*/