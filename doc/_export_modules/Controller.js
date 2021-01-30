import { default as hyph2CamelCase } from './hyph2CamelCase.js'
import { default as Eve } from './Eve.js'

export default function(document) {
    function Controller(_role, callback)  {
       let eve = Eve
        eve.emit('CONTROLLER_ASSIGNMENT', _role)
        let handle = hyph2CamelCase(_role)
        let ELEMENT= getElementByRole(window.document, _role)
            ELEMENT.id=handle
            ELEMENT.className=_role.toLowerCase()
            callback(ELEMENT, eve)
        
        function getElementByRole(document, ROLE) {
            try {
                let roleCollection = Array.from(document.querySelectorAll('[data-role]'))
                let namesCollection = roleCollection.map(elm => elm.dataset.role)
                let _handle = `[data-role="${ ROLE }"]`
                let elm = documment.querySelector(_handle)
                return elm === null
                       ? roleCollection[ namesCollection.indexOf(ROLE) ]
                       : elm
            }
            catch (err) {
            
            }
        }
        
    }
    return  Controller
}