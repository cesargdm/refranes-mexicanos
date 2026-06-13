// Validates packages/data/refranes.json against the canonical schema.
// Run: bun packages/data/validate.ts
import refranes from './refranes.json'

const ID_RE = /^[a-z0-9ñ]+(-[a-z0-9ñ]+)*$/
const TIPOS = new Set(['refrán', 'dicho'])

const errors: string[] = []
const seen = new Set<string>()

if (!Array.isArray(refranes)) {
	console.error('refranes.json must be an array')
	process.exit(1)
}

for (const [i, entry] of (refranes as unknown[]).entries()) {
	const where = `entry ${i}`
	if (typeof entry !== 'object' || entry === null) {
		errors.push(`${where}: not an object`)
		continue
	}
	const e = entry as Record<string, unknown>
	const { id, refran, significado, tipo } = e

	if (typeof id !== 'string' || !ID_RE.test(id)) {
		errors.push(`${where}: invalid id ${JSON.stringify(id)}`)
	} else if (seen.has(id)) {
		errors.push(`${where}: duplicate id "${id}"`)
	} else {
		seen.add(id)
	}

	if (typeof refran !== 'string' || refran.trim() === '') {
		errors.push(`${where} (${String(id)}): empty refran`)
	}
	if (typeof significado !== 'string' || significado.trim() === '') {
		errors.push(`${where} (${String(id)}): empty significado`)
	}
	if (typeof significado === 'string' && /TERMINAR/.test(significado)) {
		errors.push(`${where} (${String(id)}): leftover TERMINAR marker`)
	}
	if (typeof tipo !== 'string' || !TIPOS.has(tipo)) {
		errors.push(`${where} (${String(id)}): invalid tipo ${JSON.stringify(tipo)}`)
	}
}

if (errors.length > 0) {
	console.error(`✗ ${errors.length} validation error(s):`)
	for (const err of errors) console.error('  - ' + err)
	process.exit(1)
}

console.log(`OK: ${(refranes as unknown[]).length} refranes válidos`)
