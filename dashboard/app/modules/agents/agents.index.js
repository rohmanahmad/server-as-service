import authModules from './auth/auth.index'
import mainModules from './main/main.index'
import rolesModules from './roles/roles.index'

export default {
    ...authModules,
    ...mainModules,
    ...rolesModules
}