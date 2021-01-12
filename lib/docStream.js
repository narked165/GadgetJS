function docStream(request) {
    let _location = joinPath(__dirname, 'doc', request)
    
    fsAsync.open(_location, 'r', 0o666)
        .then(fd => {
            fd.close()
        })
        
        .catch(err => {
            err.code === 'ENOENT'
            ? console.warn('File does not exist')
            : console.warn('another error: ' + err)
        })
    return rStream(_location, { autoClose: false })
}




module.exports = { docStream }