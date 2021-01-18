import hyph2CamelCase from './hyph2CamelCase.js'



const Controller = function (_role, callback) {
   
    let ELEMENT
    try {
        ELEMENT = document.querySelector(`[data-role="${ _role }"]`)
        ELEMENT.id = hyph2CamelCase(_role)
        ELEMENT.className = _role.toLowerCase()
        callback(ELEMENT)
        return ELEMENT
    }
    catch (err) {
        console.warn(err)
    }
}

export { Controller }

