
/* ############### GLOBAL UTILITIES ################ */
import utilityComponents from 'appcomponents/utilities/index-utilities.js'
import formComponents from 'appcomponents/forms/index-forms'

const moduleObject = {
    // utilities
    ...utilityComponents,
    // forms
    ...formComponents,
}

export const tagComponents = Object.keys(moduleObject)

export default function tagModule(name) {
    return moduleObject[name]
}