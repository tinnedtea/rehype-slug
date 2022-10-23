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

Simply provide a slugging-algorithm when using this plugin...

```js
import { rehype } from 'rehype'
import slug from '@tinnedtea/rehype-slug'

await rehype()
	.use(slug, string => string.replace(/[^a-z]+/gi, '-'))
	.process('<h1>Good morning!</h1>')
// returns '<h1 id="Good-Morning-">Good morning!</h1>'
```

...or supply a *config* object.

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

The *config* object accepts the following parameters:
- `overwrite`, an option to overwrite existing ids: `boolean` *(defaults to `false`)*
- `slugger`, the slugging-algorithm: `(textContent: string) => string` *(required)*
- `test`, a node-matcher provided to [`hast-util-is-element`](https://github.com/syntax-tree/hast-util-is-element): [`Test`](https://github.com/syntax-tree/hast-util-is-element#function-testelement-index-parent) *(defaults to heading elements)*
- `uniqueifier`, a function which makes a generated slug more unique: `(slug: string, instance: number, textContent: string) => string` *(defaults to `${ slug }-${ instance }`)*

The whole package is documented using JSDoc-comments, but feel free to report if something isn't clear.

## Licence

This plugin is licensed under the **GNU General Public License v3.0 or later**.

The complete licence is provided in [`/licence`](/licence).
