<div align='center'>

# [@tinnedtea/rehype-slug](https://npmjs.com/package/@tinnedtea/rehype-slug)

Add ids to your [`rehype`](https://github.com/rehypejs/rehype)-nodes.

</div>

## About

This [`rehype`](https://github.com/rehypejs/rehype)-plugin allows you to add ids (also known as slugs) to your nodes.
No slugging-algorithm is shipped with this package, so you have to provide your own.
By default only headings without an id recieve a slug, but this behaviour can be configured.

A logical error present in [`rehype-slug`](https://github.com/rehypejs/rehype-slug) is also fixed here, namely that it does not take in account ids already living in the document. My plugin appends `-${ number }` (again, configurable) to prevent duplicates.

## Usage

Install the plugin using npm...

```sh
npm install @tinnedtea/rehype-slug
```

...then provide a slugging-algorithm...

```js
import { rehype } from 'rehype'
import slug from '@tinnedtea/rehype-slug'

await rehype()
	.use(slug, string => string.toLowerCase().replace(/[^a-z]+/g, '-'))
	.process('<h1>Gecko! 🦎</h1>')
// returns '<h1 id="gecko-">Gecko! 🦎</h1>'
```

...or a `Config` object.

```js
import { rehype } from 'rehype'
import slug from '@tinnedtea/rehype-slug'

await rehype()
	.use(slug, {
		slugger: () => 'slug',
		overwrite: true,
		test: () => true,
		uniqueifier: (slug, instance) => `${ slug }-${ instance }-electric-boogaloo`
	})
	.process('<p/><i id="id"/>')
// returns '<p id="slug"/><i id="slug-2-electric-boogaloo"/>'
```

A `Config` object consists of the following parameters:
- `slugger`, the slugging-algorithm: `(textContent: string, node: Rehype.Element) => string` ***(mandatory)***
- `overwrite?`, an option to overwrite existing ids: `boolean` *(defaults to `false`)*
- `test?`, a node-matcher provided to [`hast-util-is-element`](https://github.com/syntax-tree/hast-util-is-element): [`Test`](https://github.com/syntax-tree/hast-util-is-element#function-testelement-index-parent) *(defaults to heading elements)*
- `uniqueifier?`, a function, which makes a generated slug more unique: `(slug: string, instance: number, textContent: string, node: Rehype.Element) => string` *(defaults to `${ slug }-${ instance }`)*

## Building

This project is powered by TypeScript and features JSDoc-comments.
A build-script is provided to compile the code into regular JavaScript:

First clone the repo...
```sh
git clone https://gitlab.com/tinnedtea/rehype-slug.git && \
	cd ./rehype-slug
```

...then install the dependencies...
```sh
npm ci
```

... and finally compile the package.
```sh
npm run build
```

And voilá, a `build` folder popped up with the compiled JavaScript! 
The `rehype-slug` directory is now ready to be pushed to a registry.

## Licence

This plugin is licensed under the **GNU General Public License v3.0 only**.  
The complete licence is provided in [`/licence`](/licence).
