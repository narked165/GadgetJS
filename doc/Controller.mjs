import { hyph2CamelCaseTransformer } from './hyph2CamelCaseTransformer.mjs'
import { Eve } from '/Eve'

let ms = hyph2CamelCaseTransformer('more-spork')

console.log(ms)

export default function Controller (_role, callback) {
    Eve.apply(this)
    let ELEMENT
    try {
        ELEMENT = document.querySelector(`[data-role="${ _role }"]`)
        ELEMENT.id = camelCaseTransformer(_role)
        ELEMENT.className = _role.toLowerCase()
        callback(ELEMENT)
        return ELEMENT
    }
    catch (err) {
        console.warn(err)
    }
}

