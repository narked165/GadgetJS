const decaf = require('../../src/decaf')
const { DataStream : dataStream } = require('../../src/DataStream/index.js')
const { join: joinPath } = require('path')
module.exports = {
    uTests() {
        
            decaf.on('dataStream - index is reachable & Server starts.', () => {
                return typeof dataStream !== 'undefined'
            })
            decaf.on('$DOCROOT points to correct path', () => {
                return dataStream.$DOCROOT === joinPath(__dirname, '..', '..', 'doc')
            })
            decaf.on('addApp correctly adds the app to _APPCACHE_', () => {
                dataStream.addApp('test')
                return 'test' in dataStream.CACHE
            })
            
            
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    }
    
}