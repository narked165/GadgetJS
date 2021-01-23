function locationObserver() {
const Observer = {
  
  events: {},
  
  timestamp() {
    return new Date()
      .toLocaleTimeString()
  },
  
  on(type, handler) {
    this.events[type] = this.events[type] || []
    this.events[type].push(handler)
  },
  
  emit(type, timestamp, location) {
    return type in this.events 
    	? this.events[type].forEach(evt => evt.call(this, timestamp, location))
    	: console.warn(`[!] [EVENT-TYPE-ERROR] [ ${ this.timestamp() } ] :: EVENT-TYPE:  ${ type }, is not currently registered.\n`)
  },
  
  init() {
    let OBSERVE_LIST = { HREF_CHANGE_OCCURANCE: "HREF_CHANGE_OCCURANCE" } 
    return OBSERVE_LIST
  },
  
  start() {
    
		let { HREF_CHANGE_OCCURANCE } = this.init()

		let URL_HAS_CHANGED = Observer.on(HREF_CHANGE_OCCURANCE, (timestamp, locationHREF) => {
	  	console.log(`At ${ timestamp }, the URL-HREF changed to: ${ locationHREF }.\n`)
		})
    
    return { HREF_CHANGE_OCCURANCE, URL_HAS_CHANGED }
  
  }
}

// ---------------------------------------------------------------------------------------->

const { HREF_CHANGE_OCCURANCE, URL_HAS_CHANGED } = Observer.start()


const LOCATION = {
  CURRENT: null,
  modify(loc) {
    this.CURRENT = loc 
    Observer.emit(HREF_CHANGE_OCCURANCE, Observer.timestamp(), loc)
  }
}

// ------------------------------------------------------------------------------------------->
setInterval(() => {
  
  let loc = window.location.valueOf()
  
  return loc !== LOCATION.CURRENT
  	? LOCATION.modify(loc)
  	: true
  
  
}, 300)
}