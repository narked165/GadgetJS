const decaf = require('../src/decaf')
// ---------------->

gadget = require('./gadget_unit_tests')
dataStream = require(`./dataStream_unit_tests`)

// ------------------>

//gadget.uTests()
dataStream.uTests()


decaf.runCoverage()
