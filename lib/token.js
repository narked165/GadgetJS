
const IDSCM = 10101110
const COLLECTION = [IDSCM]
const CATALOG = {
    _CATALOG_: {},
    queryUID(id) {
        return id in this._CATALOG_
    },
    insert(id, Token) {
        let UID = parseInt(id)
        COLLECTION.includes(UID)
            ? this._CATALOG_[ UID ] = this._CATALOG_[ UID ] || Token
            : () => {
                do {
                    UID += 1
                }
    
                while ( UID in IDSM )
                {
                    UID += 1
                }
                this._CATALOG_[ UID ] = this._CATALOG_[ UID ] || Token
                this._CATALOG_[ UID ].id = UID
            }
        return this._CATALOG_.queryUID
    },
    
    selectAll(id) {
        return COLLECTION.includes(id)
            ? this._CATALOG_[UID]
            : "error: bad id"
    },
    
    selectFrom(id, k) {
        let ASSET = COLLECTION.includes(id)
            ? k in this._CATALOG_[UID]
                    ? ASSET[k]
                    : 'error: bad key'
            : "error: bad id"
    }
}
function Token(user) {
    let [ TOKEN, LEN] = createTokenHandle()
    this.userId = getAvailableId()
    this.name = TOKEN
    this.user = user
    this.length = LEN
    this.dateCreated = Date.now()
    return this
}

function getAvailableId() {
    let idnx = IDSCM + COLLECTION.length
    COLLECTION.push(idnx)
    return idnx
    
}
function createTokenHandle(n=256) {
    let arr = []
    arr.push(`____________________________TOKEN END__________________________________\n`)
    for(i=0;i<n;i++) {
        arr.push(Math.ceil(Math.random() * Math.pow(16, 10)).toString(34))
    }
    arr.push(`____________________________TOKEN START_________________________________\n`)
    return [arr.join(''), arr.length]
}

function createToken(_assetname) {
    let _ASSET = new Token(_assetname)
    CATALOG.insert(_ASSET.userId, _ASSET)
    return _ASSET.userId
}
let bob = createToken('bob')

module.exports = { CATALOG, Token }