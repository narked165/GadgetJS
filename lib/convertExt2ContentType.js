const conversionTable = require('../cfg/mimeTypes.json')

function fileDelimiter(ext) {
    return ext.startsWith('.')
           ? ext.toLowerCase()
           : `.${ ext.toLowerCase() }`
}
function convertExt2ContentType(ext) {
    let EXT = fileDelimiter(ext)
   return EXT in conversionTable
        ? conversionTable[EXT].trim()
        : conversionTable[".txt"].trim()
}

module.exports = { convertExt2ContentType }