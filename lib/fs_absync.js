const { promises: fsAsync } = require('fs')
function directoryContents(_location) {
    this.location = _location
    this.directory = []
    this.complete = function set(value) {
        this.resultReady = value
    }
    this.complete = function get() {
        return this.resultReady !== undefined ? this.resultReady : false
    }
    let result = new Promise((resolve, reject) => {
        try {
          let done =
              fsAsync.readdir(this.location, {withFileTypes: true})
                .then(dir => {
                   this.directory.push(dir.filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.')))
                    this.directory.push(dir.filter(dirent => dirent.isFile() && !dirent.name.startsWith('.')))
                    console.log('jore')
                })
              .catch(err => err && !done ? reject(err) : !err ) |true || false
            
            done && resolve({complete: true}) || console('ffob')
        }
        catch(err) {
            err ? reject(err) : !err
        }
    })
    result
        .then(({complete}) => { this.complete=complete })
        .catch(err => err ? console.error(err) : !err)
    while(!this.complete()) {
        result
    }
    console.log(this.complete)
    return this
}
const { join: joinPath } = require('path')
let cdir = joinPath( __dirname)

let curdir = new directoryContents(cdir)

console.log((async () => await curdir)())