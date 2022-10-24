import { isElement as matchNode } from 'hast-util-is-element'
import { toString as stringifyNode } from 'hast-util-to-string'
import { visit as walkTree } from 'unist-util-visit'

/** @type { import('./types.js').Plugin }  */
export function slug(input) {
	if (!input) {
		throw new Error('No slug-generator provided, exiting. See: https://github.com/tinnedtea/rehype-slug#usage')
	}

	/** @type { import('./types.js').Config } */
	const config = typeof input === 'object' ? input : { slugger: input }


	return tree => {
		if (!config.test) {
			config.test = function(node) {
				return /^h[1-6]$/.test(node.tagName)
			}
		}
		if (!config.uniqueifier) {
			config.uniqueifier = function(slug, instance) {
				return `${ slug }-${ instance }`
			}
		}

		/** @type { Set<string> } */
		const ids = new Set()
		/** @type { Set<import('hast').Element> } */
		const nodes = new Set()

		walkTree(tree, 'element', node => {
			if (!config.overwrite && node.properties?.id) {
				ids.add(String(node.properties.id))
			}
			if (matchNode(node, config.test)) {
				nodes.add(node)
			}
		})

		for (const node of nodes) {
			if (config.overwrite || !node.properties?.id) {
				const textContent = stringifyNode(node)
				const slug = config.slugger(textContent)

				let id = slug
				for (let instance = 2; ids.has(id); instance++) {
					id = config.uniqueifier(slug, instance, textContent)
				}

				ids.add(id)
				node.properties = {
					...node.properties,
					id
				}
			}
		}
	}
}

export default slug
