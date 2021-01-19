import hyph2CamelCase from './hyph2CamelCase.js'

export default function (_role, callback)  {
    let ELEMENT
        ELEMENT = document.querySelector(`[data-role="${ _role }"]`)
        ELEMENT.id = hyph2CamelCase(_role)
        ELEMENT.className = _role.toLowerCase()
        callback(ELEMENT)
        return ELEMENT
    
    return ELEMENT
}

