const config = {
    a: '7fa42b5237fffa44a01d766b566ca6c18cf8e9eced8b34f61bc86ca722f9235d',
    b: '41e40637f14e28a022cccc528b89b128'
}
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}
function hexStringToArrayBuffer(hexString) {
    hexString = hexString.replace(/^0x/, '');
    if (hexString.length % 2 != 0) {
        console.log('WARNING: expecting an even number of characters in the hexString');
    }
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log('WARNING: found non-hex characters', bad);    
    }
    var pairs = hexString.match(/[\dA-F]{2}/gi);
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    var array = new Uint8Array(integers);
    return array.buffer;
}
export const encrypt = (text) => {
    return new Promise((resolve, reject) => {
        let key = hexStringToArrayBuffer(config.a);
        let iv = hexStringToArrayBuffer(config.b);
        text = new TextEncoder().encode(text)
    
        window.crypto
            .subtle
            .importKey('raw', key, 'AES-GCM', false, ['encrypt'])
            .then((importedKey)=>{
                const enc = window.crypto.subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: iv,
                    },
                    importedKey,
                    text
                )
                enc
                    .then((buffer) => {
                        resolve(buf2hex(buffer))
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}