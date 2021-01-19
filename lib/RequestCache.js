const Request_Cache = {
    cache: {},
    uid(n) {
        let i, arr = []
        for(i=0; i < n; i++) {
           arr.push(Math.ceil(Math.random() * Math.pow(10, n)).toString(34))
        }
        return arr.join('').toLowerCase().trim()
        },
    add(UID, response) {
        let _uid = UID + Date.now()
        this.cache[_uid] = this.cache[_uid] || []
        this.cache[_uid].push(response)
        return _uid
    },
    reqPipe(type, data) {
       return type in this.cache
              ? this.cache[type][0]
              : console.warn(`No, registered uid: ${ type }...\n`)
    }
}

module.exports = { Request_Cache }