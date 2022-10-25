<h1 align='center'>
  	<a href='https://npmjs.com/package/@tinnedtea/rehype-slug'>@tinnedtea/rehype-slug</a>
</h1>

<p align='center'>Add ids to your <a href='https://github.com/rehypejs/rehype'><code>rehype</code></a>-nodes.</p>

## About

This [`rehype`](https://github.com/rehypejs/rehype)-plugin enables you to add ids (also known as slugs) to nodes.
There is no default slugging-algorithm, you have to provide your own.
By default only headings without an id recieve a slug, but this behaviour can be configured.

This plugin also fixes a logical error present in [`rehype-slug`](https://github.com/rehypejs/rehype-slug), namely that it does not take in account ids already living in the document. My fork appends `-${ number }` by default to prevent this.

## Usage

Install the plugin using your favorite package manager...

```sh
npm install @tinnedtea/rehype-slug
```

...then provide a slugging-algorithm...

```js
import { rehype } from 'rehype'
import slug from '@tinnedtea/rehype-slug'

await rehype()
	.use(slug, string => string.replace(/[^a-z]+/gi, '-'))
	.process('<h1>Good morning!</h1>')
// returns '<h1 id="Good-Morning-">Good morning!</h1>'
```

...or a `Config` object.

```js
import { rehype } from 'rehype'
import slug from '@tinnedtea/rehype-slug'

await rehype()
	.use(slug, {
		overwrite: true,
		slugger: () => 'slug',
		test: () => true,
		uniqueifier: (slug, instance) => `${ slug }-${ instance }-electric-boogaloo`
	})
	.process('<p/><i id='id'/>')
// returns '<p id='slug'/><i id='slug-2-electric-boogaloo'/>'
```

The `Config` object accepts the following parameters:
- `overwrite`, an option to overwrite existing ids: `boolean` *(defaults to `false`)*
- `slugger`, the slugging-algorithm: `(textContent: string) => string` *(required)*
- `test`, a node-matcher provided to [`hast-util-is-element`](https://github.com/syntax-tree/hast-util-is-element): [`Test`](https://github.com/syntax-tree/hast-util-is-element#function-testelement-index-parent) *(defaults to heading elements)*
- `uniqueifier`, a function which makes a generated slug more unique: `(slug: string, instance: number, textContent: string) => string` *(defaults to `${ slug }-${ instance }`)*

## Building

This project is powered by TypeScript and JSDoc. It features a build-process to compile into regular JavaScript.

First clone the repo...
```sh
git clone https://github.com/@tinnedtea/rehype-slug
```
```sh
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

Voila, A `build` folder popped up with the compiled JavaScript! The `rehype-slug` directory is now ready to be pushed to a NPM-Registry.

## Licence

This plugin is licensed under the **GNU General Public License v3.0 or later**.

The complete licence is provided in [`/licence`](/licence).
