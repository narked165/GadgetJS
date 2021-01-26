const gadgets = {
    load(handle) {
        let gadgetPath = `http://localhost:9010/gadgets/${ handle }`
        let gadgetCtrl = `${ gadgetPath }/index.js`
        let gadgetStl = `${ gadgetPath }/index.css`
        fetch(gadgetCtrl)
            .then(response => {
                let gadgetControl = response.text()
                document.body.innerHTML+=`<script>${gadgetControl}</script>`
            })
            .then(() => {
                document.head.append(`<link rel="stylesheet" type="text/css" href="${ gadgetStl }"/>`)
            })
            
            .catch(err => {
                err ? console.warn(err) : !err
        })
        
        
    }
}

export { gadgets }