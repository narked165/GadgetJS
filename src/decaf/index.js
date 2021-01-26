const assert = require('assert'),
    path = require('path')
    
const Decaf = (function(){
// Main export literal
let decaf = {

    //  Simple timestamp generator
    timestamp() {
      let _d = new Date()
      return _d.toLocaleString()
    },


    //  Coverage literal object
    coverage: {},

    manifest() {
        return {
            Total: Object.keys(this.coverage).length,
            conditions: Object.keys(this.coverage),
            Tests: Object.entries(this.coverage)
        }
    },



    //  Event-test ADD-EVENT/ SUBSCRIBER  method
    on(condition, Fn) {
       this.coverage[condition] = this.coverage[condition] || []
       this.coverage[condition].push(Fn)
    },



    //  Multipurpose test info-logger to provide additional details about the scope or workflow.
    describe(option) {
        let {title, description, expected, header = header || false} = option,
            data = !header
                   ? {title, description, Expect: `-> EXPECTS: ${expected}`}
                   : {title, description, Expect: ""}
             console.log("\x1b[1m\x1b[36m\x1b[40m",`     
        \t\t TITLE: ${ data.title }
        \t    -> TIMESTAMP: ${ test.timestamp() }   
         \t    -> DESCRIPTION: ${ data.description }
         \t          ${ data.Expect }
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  \n\n`)
    },


    //  Non-essential glamor ascii art, I had to call it something...
    decafHead() {
        console.info("\x1b[1m\x1b[36m\x1b[40m", `
        
        * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
         C O V E R A G E    T E S T I N G    B Y   V A N I L L A   N O D E J S   &     
        
                               <[_]    D E C A F - J S     [_]>
                                                       
                           * * * * * * * * * * * * * * * * * * * *
                           *                                     *
                           *  decaF( vanillaJS ) {               *
                           *                                     * * * * *  
                           *     EVENT  TESTING  COVER&GE        * * * * * *
                           *                                     *        * *
                           *     <[_]   { /WITH }   [_]>       *         * *
                           *                                     *         * *
                           *     ZERO: 3rd Party Dependency      *         * *
                           *                                     *         * *
                           *       return productivity;          *         * *
                           *                                     * * * * * * *
                           *   };                                * * * * * * *          
                           *                                     *
                           *                                     *
                           *  // returns productivity            *
                           *                                     *
                           * * * * * * * * * * * * * * * * * * * * 
                              
                              
     
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        `,"\x1b[22m")
    },



    //  A Force removhat removes the associate conditional key and all of its inherited child functions.
    removeCondition(condition) {
      this.coverage[condition]
        ? delete this.coverage[condition]
        : console.warn(`EVENT-TEST: ${ condition }, does not exist.`)
    },


    //  Event-test EMIT/ Publish method
    run(condition, params) {
        this.coverage[condition]
            ? this.coverage[condition].map(cond => {
                console.info("\x1b[33m", `\t -> TESTING:  ${ condition }`)
                let result = assert(cond.apply(this, [ params ]), condition)
                console.log("\x1b[32m", `\n\t\t ->  TEST RESULT: ${ typeof(result) === 'undefined' ? 'Pass' : 'Fail' }\n\n`)
              })
            : console.warn(`Condition: ${ condition }, is not registered in coverage.`)
    },


    //  Event-test EMIT-All/ PUBLISH-ALL method
    runCoverage() {

        let tests = Object.keys(decaf.coverage)
        tests.map(test => decaf.run(test))

        return this.decafHead()
    }
}

    return {
        manifest() {
            return decaf.manifest()
        },

        on(condition, functionExpression) {
           return decaf.on(condition, functionExpression)
        },

        describe(options) {
            return decaf.describe(options)
        },

        removeCondition(condition) {
            return decaf.removeCondition(condition)
        },

        run(condition, params) {
            return decaf.run(condition, params)
        },

        runCoverage() {
            return decaf.runCoverage()
        }
    }
    return decaf
})()


//  NodeJs, CommonJs export
module.exports = Decaf

//  EcmaScript6 export
//export default Test

//  Test functionality
// Test.on('Two plus Two is four', () => 2 + 2 === 4)
// Test.on('Two plus two equals five', () => 2 + 2 === 5)
// Test.removeCondition('Two plus Two is four')
// Test.runCoverage()