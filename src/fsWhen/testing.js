const { fsWhen } = require('./index.js')
const { join: joinPath } = require('path')
const ERROR_EVENT = 'ERROR-EVENT'
const fs = require('fs')
const VERIFY_ACCESS = function(vbit) {
    !vbit
        ? fsWhen.emit(ERROR_EVENT, new Error('Inaccessable file or folder location passed as param.'))
        : console.log(`Verified Access.`)
    return vbit
}

const VERIFY_NO_ACCESS = function(vbit) {
    vbit === true
        ? fsWhen.emit(ERROR_EVENT, new Error('File or folder location exists, Creation of param, can not continue.'))
        : console.log('File or folder param can be created.')
}

/*
 let timestamp = new Date(Date.now() / 1000).getSeconds()
 let timeMedian = new Date('1-1-2020')
 console.log(timestamp)
 fsWhen.lutimes('./test.txt', timestamp, timeMedian, VERIFY_ACCESS, (vbit) => {
 vbit ?  console.info('Operation Complete') : console.warn('There was a problem')
 })

 // -------------->
 fsWhen.mkdtemp('foobles', VERIFY_NO_ACCESS, ( dir, vbit) => {
 vbit && console.log(dir)
 })
 
 fsWhen.realPath('./test.txt', VERIFY_ACCESS, (vbit, data) => {
 vbit && console.log(data)
 })

// ------------------------>
 fsWhen.lchown('./test.txt', 501,20, VERIFY_ACCESS, (vbit, data) => {
 vbit && console.log(data)
 })
 // ----------------->
 fsWhen.lchmod('./test.txt', 0o777,VERIFY_ACCESS, (vbit, data) => {
 vbit && console.log(vbit)
 })
 // --------------->
 fsWhen.readlink('./testSymLinky.txt', VERIFY_ACCESS, (vbit, data) => {
 vbit && console.log(data)
 })
 
 // -------------->
 fsWhen.readDirectory(__dirname, VERIFY_ACCESS, (vbit, dir) => {
 vbit ? console.log(dir) : console.log('no dir')
 })
 
 // ------------>
 
 fsWhen.removeDirectory('./butt2', VERIFY_ACCESS, (vbit) => {
 vbit && console.info('done')
 })
 
 // --------------->
 fsWhen.makeDirectory('./butt2', VERIFY_NO_ACCESS, (vbit) => {
 vbit ? console.log('a butt for you') : console.log('No butt')
 })
 
 // -------------------->
 fsWhen.unlink('./test.txt', VERIFY_ACCESS, (vbit) => {
 vbit ? console.log('done') : console.warn('there was a problem...')
 })
 // ------------>
 let timestamp = new Date(Date.now() / 1000).getSeconds()
 let timeMedian = new Date('1-1-2020')
 console.log(timestamp)
 fsWhen.utimes('./test.txt', timestamp, timeMedian, VERIFY_ACCESS, (vbit) => {
 vbit ?  console.info('Operation Complete') : console.warn('There was a problem')
 })
 // -------------->
 fsWhen.renameItem('./testB.txt', './testB.txt', VERIFY_ACCESS, ( vbit) => {
 vbit
 ? console.log('RENAME ... done')
 : console.warn('There was a problem...\n')
 })
 // ---------------->
// PARAMS: _ORIGIN, DESTINATION, CALLBACK
 fsWhen.copyFileUnsafe('./test.txt', './testn.txt', (vbit) => {
 !vbit
 ? console.warn('There was a problem...\n')
 : console.log('COPYFILE ... done')
 })
 // ----------------->
 //  PARAMS: _location, _flags, _mode, callback
 fsWhen.open('./test.txt', 'r', 0o666, (vbit, fd) =>{
 !vbit
 ? console.warn('There was a problem...\n')
 : console.log('OPEN ... done' + ' ' + fd.fd)
 return fd
 })
 // ---------------->

// PARAMS: _source, _destination, _mode, callback
fsWhen.access('./test.txt', (vbit) => {
    !vbit
    ? console.warn('There was a problem...\n')
    : console.log('COPYFILE ... done')
})

// ------------------->
//  PARAMS: _source, _destination, callback
fsWhen.copyFileSafe('./test.txt', './test3.txt', (vbit) => {
    !vbit
        ? console.warn('There was a problem...\n')
        : console.log('COPYFILE ... done')
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
 
 fsWhen.renamedItem(path1, path2, ['r'], () => {
 console.log('done')
 })
 
 */