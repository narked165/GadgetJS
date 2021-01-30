import { default as Exports } from './controller.js'
import { default as Eve } from '../_export_modules/Eve.js'

const { Controller, GroupController } = Exports
const eve = Eve
eve.on('CONTROLLER_ASSIGNMENT', (role) => console.info(`Assigning Controller to element, role: ${ role }`))

eve.on('WINDOW-LOAD', () => console.log('Window has loaded.'))

window.addEventListener('load', () => eve.emit('WINDOW-LOAD'))


//  On Window DOM Loaded...
window.addEventListener('load', () => {
   
    //  Initialize Element Controllers
    
    const mainApp = Controller('main-app', mainApp => {
    
  
    })
    
    const nxsLogo = Controller( 'nxs-logo', (nxsLogo) => {
        nxsLogo.src='media/nexus22.png'
        nxsLogo.alt='NEXUS Logo'
    })
    
    const appFrame = Controller('app-frame', appFrame => {
    
    })
    
    const appHead = Controller( 'app-head', appHead => {
    
    })
    
    const footWrap = Controller('foot-wrap', footWrap => {
    
    })
    const appFoot = Controller('app-foot', appFoot => {
    
    })
    
    const navigationWrap = Controller('navigation-wrap', navigationWrap => {
    
    })
    const app0hash = Controller('app-0hash', (app0hash) => {
        app0hash.setAttribute('href', '#app0')
        app0hash.innerHTML = `<i class="fas fa-cloud"></i>`
        
        app0hash.addEventListener('click', e => {
            e.preventDefault()
            eve.emit('Gadget-icon-clicked', 'app0')
        })
        app0hash.className="gadget-shortcut"
        
    })
    const gadgetShortcut = GroupController('gadget-shortcut', gadgetShortcut => {
    
    })
    const app1hash = Controller('app-1hash', (app1hash) => {
        app1hash.setAttribute('href', '#app1')
        app1hash.innerHTML = `<i class="fas fa-cog"></i>`
        app1hash.addEventListener('click', e => {
            e.preventDefault()
            eve.emit('Gadget-icon-clicked', 'app1')
        })
        app1hash.className='gadget-shortcut'
        
    })
    const app2hash = Controller('app-2hash', (app2hash) => {
        app2hash.setAttribute('href', '#app2')
        app2hash.innerHTML = `<i class="fas fa-terminal"></i>`
        app2hash.addEventListener('click', e => {
            e.preventDefault()
            eve.emit('Gadget-icon-clicked', 'app2')
        })
        app2hash.className ='gadget-shortcut'
        
    })
    
    const app3hash = Controller('app-3hash', (app3hash) => {
        app3hash.setAttribute('href', '#app3')
        app3hash.innerHTML = `<i class="fas fa-coffee"></i>`
        app3hash.addEventListener('click', e => {
            e.preventDefault()
            eve.emit('Gadget-icon-clicked', 'app3')
        })
        app3hash.className = 'gadget-shortcut'
        
    })
    
    const app4hash = Controller('app-4hash', (app4hash) => {
        app4hash.setAttribute('href', '#app4')
        app4hash.innerHTML = `<i class="fas fa-database"></i>`
        app4hash.addEventListener('click', e => {
            e.preventDefault()
            eve.emit('Gadget-icon-clicked', 'app4')
        })
        app4hash.className = 'gadget-shortcut'
        
    })
    
    const app5hash = Controller('app-5hash', (app5hash) => {
        app5hash.setAttribute('href', '#app5')
        app5hash.innerHTML = `<i  class="fas fa-server"></i>`
        app5hash.addEventListener('click', e => {
            e.preventDefault()
            eve.emit('Gadget-icon-clicked', 'app5')
        })
        app5hash.className='gadget-shortcut'
        
    })
    const appActive = Controller('app-active', (appActive) => {
    
    })
    
  
    
    
})



