import { default as hyph2CamelCase } from './hyph2CamelCase.js'
import { default as Eve } from './Eve.js'

export default function (_role, callback)  {
   let eve = Eve.apply(this)
    let handle = hyph2CamelCase(_role)
    let ELEMENT= document.querySelector(`[data-role="${ _role }"]`)
        ELEMENT.id=handle
        ELEMENT.className=_role.toLowerCase()
        callback(ELEMENT, eve)
        return ELEMENT
}

