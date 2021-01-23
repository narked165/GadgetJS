import hyph2CamelCase from './hyph2CamelCase.js'

export default function (_role, callback)  {
    let handle = hyph2CamelCase(_role)
    let ELEMENT= document.querySelector(`[data-role="${ _role }"]`)
        ELEMENT.id=handle
        ELEMENT.className=_role.toLowerCase()
        callback(ELEMENT)
        return ELEMENT
}

