import AuthRoutes from './auth/routes'
import ServerAsServiceRoutes from './server-as-service/routes'

export default [
    ...AuthRoutes,
    ...ServerAsServiceRoutes,
]