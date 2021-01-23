

window.addEventListener('load', () => {
    const ELEMENTS = registerCollection()
    const { Controller } = elementCache(ELEMENTS)
    const main = Controller('main', (main) => {
    
    })
    
    const app = Controller('app', (app) => {
    
    })
    
    const appTitle = Controller('app-title', (appTitle) => {
        appTitle.innerHTML = "<span class='gadget-title'>G A D G E T </span><span class='js-title'> j s .</span>"
    })
    
    const appTagline = Controller('app-tagline', (appTagline) => {
        appTagline.innerHTML = "Vanilla JavaScript, A Fine Little Language."
    })
    
    const appContainer = Controller('app-container', (appContainer) => {
    
    })
    
    const loadTitle = Controller('load-title', (loadTitle) => {
    
    })
    
    const uniCornTainer = Controller('uni-corntainer', (uniCorntainer) => {
    
    })
    
    const unicorn = Controller('unicorn', (unicorn) => {
        unicorn.innerHTML ="&#129412;"
    })
    const progressDots = Controller('progress-dots', (progressDots) => {
       let loadDots = document.querySelectorAll(`[data-role="load-dot"]`)
       let baseColors = [
           "base-red-dot",
           "base-yellow-dot",
          
           "base-blue-dot",
           "base-orange-dot",
           "base-green-dot",
       ]
       
        console.log(baseColors)
        
        function loadingAnimation() {
           loadDots.forEach(dot => {
               dot.classList.contains('it') &&
                dot.classList.remove('it')
               dot.classList = "load-dot"
               dot.classList.remove(baseColors[nextDot.itr-2])
             
              
             
           })
            loadDots[nextDot.itr].classList.remove('not-it')
            loadDots[nextDot.itr].classList.add(baseColors[nextDot.itr])
            loadDots[nextDot.itr].classList.add('it')
        }
        
        nextDot.itr = 0
        nextDot.advanceSafe = function() {
        
          console.log('initial--> loadDots: ' + loadDots.length, `itr:` + nextDot.itr)
            loadingAnimation()
          
       }
       
      function nextDot() {
         
           requestAnimationFrame(() => {
               nextDot.itr >= ( -1 + loadDots.length) ? nextDot.itr =nextDot.itr * false |0  : nextDot.itr= nextDot.itr+=1
      
           })
      }
        
        setInterval(() => {
            nextDot.advanceSafe()
            nextDot(nextDot.itr)
        }, 1000)
       
        }, 1000)
})
function convert2CamelCase(value) {
    let _result = []
    let charArray = typeof ( value ) !== 'undefined' && typeof ( value ) === 'string' && value.includes('-')
                    ? Array.from(value)
                    : Array.from(value.toLowerCase())
    do {
        charArray.forEach((chr, i) => {
            transform(charArray.pop(), char => _result.unshift(char))
            
        })
    } while ( charArray.length )
    
    
    function transform(char, callback) {
        let processed = char !== '-'
                        ? char
                        : '' + _result.shift().toUpperCase()
        callback(processed)
    }
    
    return _result.join('').toString().trim()
}
function registerCollection() {
    return document.querySelectorAll(`[data-role]`)
}

function elementCache(_collection) {
    let ELEMENTS = {
        ELEMENT_COLLECTION: _collection,
        ELEMENT_ROLES: Array.from(_collection).map(elm => elm.dataset.role),
        elementHandle(_role) {
            let ELEMENT = this.ELEMENT_ROLES.includes(_role)
                          ? this.ELEMENT_COLLECTION[ this.ELEMENT_ROLES.indexOf(_role) ]
                          : null
            return ELEMENT
            
        },
        Controller(_role, callback) {
            let ELEMENT = ELEMENTS.elementHandle(_role)
            ELEMENT.id = convert2CamelCase(_role)
            ELEMENT.className = _role
            ELEMENT.name = _role
            callback(ELEMENT)
            return ELEMENT
            
        }
    }
    return ELEMENTS
}
