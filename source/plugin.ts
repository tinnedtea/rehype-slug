import path from 'node:path'
import url from 'node:url'
import * as hastMatcher from 'hast-util-is-element'
import * as hastStringifier from 'hast-util-to-string'
import * as unistTree from 'unist-util-visit'
import type Rehype from 'hast'
import type * as Unified from 'unified'

export interface Config {
	/**
		Defines if existing ids should be overwritten.
	*/
	overwrite?: boolean,

	/**
		A function, which generates the desired slug. This plugin handles
		duplicate ids in {@link Config.uniqueifier | `uniqueifier`}, so there
		is no need for a fancy object wrapper.
	*/
	slugger: (textContent: string) => string,

	/**
		A {@link hastMatcher.Test | `Test`} which marks nodes as sluggable.
		Defaults to headings.
	*/
	test?: hastMatcher.Test,

	/**
		A function, which makes a slug more unique. It only gets called, if a
		generated slug (including the ones generated by this function) turns
		out to be a duplicate.
	*/
	uniqueifier?: (slug: string, instance: number, textContent: string) => string
}


/**
	Add ids to your rehype-nodes.

	@example
	import { rehype } from 'rehype'
	import slug from '@tinnedtea/rehype-slug'

	await rehype()
		.use(slug, () => String(Math.random()))
		.process('<h1/>')
	// returns '<h1 id="0.69..."/>'
*/
export const slug: Unified.Plugin<Array<Config | Config['slugger']>, Rehype.Root> = function(input) {
	if (!input) {
		const plugin: string = url.fileURLToPath(import.meta.url)
		const module: string = path.join(plugin, '../..')
		const readme: string = `.${ path.sep }` + path.relative(process.cwd(), path.join(module, './readme.md'))

		throw new Error(
`No slug-generator provided, @tinnedtea/rehype-slug requires a second argument.
See usage in '${ readme }'.`
		)
	}
	const config: Config = typeof input === 'object' ? input : {
		slugger: input
	}

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

		const ids: Set<string> = new Set()
		const nodes: Set<Rehype.Element> = new Set()

		unistTree.visit(tree, 'element', node => {
			if (!config.overwrite && node.properties?.id) {
				ids.add(String(node.properties.id))
			}
			if (hastMatcher.isElement(node, config.test)) {
				nodes.add(node)
			}
		})

		for (const node of nodes) {
			if (config.overwrite || !node.properties?.id) {
				const textContent: string = hastStringifier.toString(node)
				const slug: string = config.slugger(textContent)

				let id: string = slug
				for (let instance: number = 2; ids.has(id); instance++) {
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
