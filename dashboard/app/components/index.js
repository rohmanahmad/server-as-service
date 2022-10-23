
/* ############### GLOBAL UTILITIES ################ */
import utilityComponents from 'components/utilities/index-utilities.js'
import formComponents from 'components/forms/index-forms'

/* ############### EKYC ################ */
import ekycComponents from 'appModule/ekyc/@components/index.ekyc'

/* ############### PENDING APPROVAL ################ */
import pendingApprovalComponents from 'appModule/pending-tasks/@components/index.pending-tasks'

/* ############### ADMINISTRATION ################ */
import supportAdmin from 'appModule/support-admin/@components/index.support-admin'

/* ############### PUSH NOTIFICATION ################ */
import pushnotificationComponents from 'appModule/push-notification/@components/index.pushnotification'

/* ############### BILLPAYMENT ###################### */
import billpaymentComponents from 'appModule/billpayment/@components/index.billpayment'


const moduleObject = {
    // pending approval
    ...pendingApprovalComponents,
    // utilities
    ...utilityComponents,
    // forms
    ...formComponents,
    // ekyc
    ...ekycComponents,
    // support admin
    ...supportAdmin,
    // bill payment
    ...billpaymentComponents,
    // notification
    ...pushnotificationComponents
}

export const tagComponents = Object.keys(moduleObject)

export default function tagModule(name) {
    return moduleObject[name]
}