export const addClass = function (elem, newClass) {
    if (elem) elem.className += " " + newClass
}

export const removeClass = function (elem, removedClass) {
    if (elem) {
        const arr = elem.className
            .split(" ")
            .filter(x => x !== removedClass)
        elem.className = arr.join(' ')
    }
}