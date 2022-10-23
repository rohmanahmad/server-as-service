
import AdministrationPages from './server-as-service/pages'
import AuthPages from './auth/pages'

const moduleObject = {
    ...AdministrationPages,
    ...AuthPages,
}

export default function module(name) {
	return moduleObject[name]
}