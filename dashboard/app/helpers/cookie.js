export const setCookie = (cname, cvalue, exSecond) => {
    let d = new Date()
    d.setTime(d.getTime() + (exSecond * 1000))
    let expires = "expires="+d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

export const getCookie = (cname) => {
    let name = cname + "="
    let ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return false
}

export const eraseCookie = (cname) => {
    setCookie(cname, "", -1)
}

export const checkCookie = (cname) => {
    let user = getCookie(cname)
    if (user) {
        return true
    } else {
        return false
    }
}