export default function Eve() {
    this.EventEmitter = {
        events: {},
        
        timestamp() {
            return `[ ${ new Date().toLocaleTimeString() } ]`
        },
        on(type, handler) {
            this.events[ type ] = this.events[ type ] || []
            this.events[ type ].push(handler)
        },
        emit(type, data) {
            type in this.events
            ? this.events[ type ].forEach(evnt => evnt.call(this, data))
            : console.warn(`[</>] [DEBUG] ${ new Date().toLocaleTimeString()} :: Event: ${ type }, is not registered.`)
        },
        
        emitDefer(type, data) {
            process.nextTick(() => this.emit(type, data))
        },
        
        emitProxyProc(type, data, proc, index, interval) {
            let Proc = setInterval(() => this.emit(type, data), interval)
            Proc.cancel = () => {
                clearInterval(Proc)
                this.emit('PROCESS-CANCELED', proc)
            }
            return Proc
        },
        
        emitDelay(type, data, delaym) {
            setTimeout(() => this.emit(type, data), delaym)
        },
        
        off(type) {
            this.events[ type ]
            ? delete this.events[ type ]
            :  console.warn(`[</>] [DEBUG] ${ new Date().toLocaleTimeString()} :: Event: ${ type }, is not registered.`)
        },
        once(type, handler) {
            this.on(type, handler)
            this.on(type, () => delete this.events[ type ])
            
        },
        show() {
            console.group(Object.keys(this.events))
            console.groupEnd()
        },
    }
    
    
    return this.EventEmitter
}

let eve = new Eve('eve')
