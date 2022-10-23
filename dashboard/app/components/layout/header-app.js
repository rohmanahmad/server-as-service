import { checkup } from 'appmodules/utilities/utilities.sdk'
import { goTo } from 'apphelpers/ma'
import { getCookie } from 'apphelpers/cookie'
import { debugLog } from 'apphelpers/utilities'

export default {
    state: {
        menu: [{
            name: "Ticket",
            icon: 'ion-ios-chatboxes-outline'
        }, {
            name: "Publish",
            icon: 'ion-ios-compose-outline'
        }, {
            name: "Dashboard",
            icon: 'ion-ios-monitor-outline'
        }, {
            name: "Report",
            icon: 'ion-ios-chatboxes-outline'
        }, {
            name: "Setting",
            icon: 'ion-ios-gear-outline'
        }],
        profileMenu: {
            isActive: false
        }
    },
    getProfileMenu() {
        return this.classNames({
            show: this.state.profileMenu.isActive,
        })
    },
    openProfile(e) {
        e.preventDefault()
        this.toggleProfile()
    },
    toggleProfile() {
        this.state.profileMenu.isActive = !this.state.profileMenu.isActive
        this.update()
    },
    goTo(link) {
        this.state.profileMenu.isActive = false
        this.update()
        debugLog(link)
        goTo(link)
    },
    doCheckup(e) {
        e.preventDefault()
        this.state.profileMenu.isActive = false
        this.update()
        checkup()
            .then(function (res) {
                Swal.fire({
                    type: 'success',
                    title: 'Checkup Success'
                })
            })
            .catch(console.error)
    },
    onMounted() {
        window.cekProfile = this
        setTimeout(() => {
            $('[data-toggle="tooltip"]').tooltip();
        })
        this.lastLogin = localStorage.getItem('lastLogin')
        this.state.profileMenu.isActive = false
        this.full_name = getCookie('name')
        this.userid = getCookie('userid')
        this.update()
    }

}