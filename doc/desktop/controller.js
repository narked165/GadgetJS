const Exports = { Controller, GroupController, camelCaseTransformer, Gadgets : Gadgets(), eve: Eve() }



function Eve() {
    const eve = {
        events: {},
        on(type, handler) {
            this.events[ type ] = this.events[ type ] || []
            this.events[ type ].push(handler)
        },
        
        emit(type, data) {
            type in this.events
            ? this.events[ type ].forEach(evt => evt.call(this, data))
            : console.warn(`No such event, could not bind to caller-type: ${ type }..\n`)
        }
    }
    eve.on('Gadget-icon-clicked', (handle) => gadgets.handlers.load(handle))
    return eve
}



function Gadgets() {
    
    const gadgets = {}
    
    gadgets.constants = {
        $HOMEDIR: "http://localhost:9010/gadgets"
    }
    
    gadgets.tools = {
        apppath(_handle) {
            return {
                scrpt: `${ gadgets.constants.$HOMEDIR }/${ _handle }/index.js`,
                style: `${ gadgets.constants.$HOMEDIR }/${ _handle }/index.css`
            }
        }
    }
    gadgets.handlers = {
        load(handle) {
            let { scrpt, style } = gadgets.tools.apppath(handle)
            
            fetch(scrpt)
                .then(response => {
                    return response.text()
                })
                
                .then(txt => {
                    let elem = document.createElement('script')
                    elem.innerHTML = txt
                    elem.id = 'elemScript'
                    document.querySelector('.app-active').appendChild(elem)
                })
                .then(() => {
                    let link = document.createElement('link')
                    link.setAttribute('rel', 'stylesheet')
                    link.setAttribute('type', 'text/css')
                    link.setAttribute('href', style)
                    document.head.appendChild(link)
                    
                    document.head.append
                })
                
                .catch(err => err ? console.warn(err) : !err)
            
            
        }
    }
 return gadgets
}





function camelCaseTransformer(value) {
    let _result = []
    let charArray = typeof ( value ) !== 'undefined' && typeof ( value ) === 'string' && value.includes('-')
                    ? Array.from(value)
                    : console.error(new Error(`[!] [Type-Error] [${ new Date().toLocaleTimeString() }] :: VALUE-STRING, must include a hyphen; recieved: ${ value.toString() }.\n`))
    do {
        charArray.forEach((chr, i) => {
            transform(charArray.pop(), char => _result.unshift(char))
            
        })
    } while(charArray.length)
    
    
    function transform(char, callback) {
        let processed = char !== '-'
                        ? char
                        : '' + _result.shift().toUpperCase()
        callback(processed)
    }
    
    return _result.join('').toString().trim()
}

function Controller (_role, callback) {
    let eve = new Eve()
    let ELEMENT
    try {
        ELEMENT = document.querySelector(`[data-role="${ _role }"]`)
        ELEMENT.id = camelCaseTransformer(_role)
        ELEMENT.className = _role.toLowerCase()
        callback(ELEMENT, eve)
        return ELEMENT
    }
    catch (err) {
        console.warn(err)
    }
}

function GroupController(_group, callback) {
    let GROUP = document.querySelectorAll(`[data-group]`)
    let HTMLGROUPCOLLECTION = document.querySelectorAll(GROUP["gadget-shortcut"])
    HTMLGROUPCOLLECTION.forEach(ELM => {
        let role = ELM.getAttribute(role)
        ELM.className = _group
        ELM.id = ELM.dataset.role
        ELM.classList.add(role)
    })
    callback(HTMLGROUPCOLLECTION)
    return HTMLGROUPCOLLECTION
}
export { Exports as default }
