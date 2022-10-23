import mainComponents from 'components/layout/layout.index'

export default function layoutModule(name) {
	return mainComponents[name]
}

export const layoutComponents = Object.keys(mainComponents)