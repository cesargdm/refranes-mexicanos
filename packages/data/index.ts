import refranesJson from './refranes.json'

export type RefranTipo = 'refrán' | 'dicho'

export type Refran = {
	id: string
	refran: string
	significado: string
	tipo: RefranTipo
}

export const refranes = refranesJson as Refran[]

export function getRandomRefran(): Refran {
	return refranes[Math.floor(Math.random() * refranes.length)]!
}

export function getRefranById(id: string): Refran | undefined {
	return refranes.find((r) => r.id === id)
}
