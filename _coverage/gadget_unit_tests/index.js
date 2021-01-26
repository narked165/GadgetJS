const decaf = require('../../src/decaf')
const gadget = require('../../index.js')

module.exports = {
    uTests() {
        return (
        decaf.on('GagdetJS index is reachable & Server starts.', () => typeof gadget !== 'undefined' )
        )
    
    }

}