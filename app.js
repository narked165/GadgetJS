const { Eve } = require('./lib/Eve.js')

const eve = new Eve()

const GadgetJs = function() {
    this.name = 'GadgetJs'
 
    return this
}
//  Eve Event Emitter - on (addListener)
GadgetJs.prototype.on = function(_type, _handler) {
    return eve.on(_type, _handler)
}

//  Eve Event Emitter - emit (callListener)
GadgetJs.prototype.emit = function(_type, _data) {
    return eve.emit(_type, _data)
}

//  Eve Event Emitter - once (addSingletonListener)
GadgetJs.prototype.once = function(_type, _handler) {
    return eve.once(_type, _handler)
}

// Eve Event Emitter - emitDefer emit an even,t on the next tick of the event loop
GadgetJs.prototype.emitDefer = function(_type, _data) {
    return eve.emitDefer(_type, _data)
}

//  Eve Event Emitter - Proxy a Process, as a custom Event Emitter (recursive)
GadgetJs.prototype.proxyProc = function(_type, _data, _proc, _index, _interval) {
    return eve.proxyProc(_type, _data, _proc, _index, _interval)
}

// Eve Event Emitter - Emit an Event after a custom interval has elapsed
GadgetJs.prototype.emitDelay = function(_type, _data, delayms){
    return eve.delayms(_type, _data, delayms)
}

GadgetJs.prototype.off = function(){
    return eve.off(type)
}

GadgetJs.prototype.show = function() {
    return eve.show()
}


module.exports = { GadgetJs }