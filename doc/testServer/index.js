import { hyph2CamelCase } from '../hyph2CamelCase.mjs'



function Controller(_role, callback) {
    let ELEMENT = document.querySelector(`[data-role="${ _role }"]`)
    ELEMENT.id=hyph2CamelCase(_role)
    ELEMENT.className-_role
    callback(ELEMENT)
    return this
}

window.addEventListener('load', () => {
    let mainApp = Controller('main-app', mainApp => {
        mainApp.innerHTML=`<h1>Test Successful!</h1>`
    })


})