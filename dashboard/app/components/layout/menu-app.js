import { find } from 'lodash'
import { getListMenu } from 'appmodules/utilities/utilities.sdk'
import { addClass, removeClass } from 'apphelpers/dom'
import { showAlertError } from 'apphelpers/utilities'
import myPendingCount from './@components/my-pending-count.riot'

export default {
    components: {
        myPendingCount
    },
    state: {
        profileMenu: {
            isActive: true
        },
        activeMenu: 'dashboard',
        isSettingMenu: false,
        isDashboardMenu: false
    },
    parentMenus: [
    ],
    onMounted() {
        this.subActive = false;
        this.renderMenu()
        // if(window.location.hash != '#/login'){
        //     this.isHasAccess = hasAccess('mypendingtask.menu');
        //     if (isHasAccess) {
        //         this.SetInterval = setInterval(()=>{ 
        //             this.renderTotal()
        //         },10 * 1000)
        //     }
        // }
        this.update()
    },
    renderMenu() {
        getListMenu()
            .then((response) => {
                let section = ['task-pendings']
                this.items = response.data.filter(x => x.name !== 'settlement-tools')
                // this.items = response.data // billpayment tolong aktifkan
                let taskPendings = find(this.items, (val, o) => {
                    return section.indexOf(val.name) > -1
                })
                this.update()
            })
            .catch((err) => {
                showAlertError(err)
            })
    },
    ActiveClass(moduleActive, menuName) {
        if (moduleActive === menuName) return 'active'
        const d = {
        }
        const name = d[moduleActive]
        if (this.parentMenus.indexOf(name) > -1) this.toggleSettings({ name })
        if (name === menuName) return 'active'
        else return ''
    },
    EventSub() {
        this.subActive = !this.subActive;
        this.update()
    },
    onUnmounted() {
        // clearInterval(this.SetInterval)
    },
    toggleSettings({ name }) {
        const collapsedParents = this.parentMenus.filter(x => x !== name)
        console.log({ collapsedParents })
        for (const p of collapsedParents) {
            removeClass(document.getElementById(p), 'd-block')
        }
        if (['report', 'task-pendings'].indexOf(name) === -1) {
            const elem = document.getElementById(name)
            addClass(elem, 'd-block')
        }
    }
}