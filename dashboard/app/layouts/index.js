import mainComponents from 'appcomponents/layout/layout.index'

export default function layout(name) {
	return mainComponents[name]
}

export const layoutComponents = Object.keys(mainComponents)