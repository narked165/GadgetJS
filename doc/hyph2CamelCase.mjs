function hyph2CamelCase(value) {
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

export { hyph2CamelCase }