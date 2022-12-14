<div align='center'>

# [@tinnedtea/rehype-slug][Package]

Add ids to your [`rehype`][Rehype]-nodes.

</div>

## About

This [`rehype`][Rehype]-plugin allows you to add ids (also known as slugs) 
to your nodes. No slugging-algorithm is shipped with this package, so you 
have to provide your own. By default only headings without an id recieve
a slug, but this behaviour can be configured.

A logical error present in [`rehype-slug`][Rehype Slug] is also fixed here,
namely that it does not take in account ids already living in the document.
My plugin appends `-${ number }` (again, configurable) to prevent duplicates.

## Usage

Install the plugin from npm[^Registries]...

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

- `slugger`, the slugging-algorithm:
`(textContent: string, node: Rehype.Element) => string`
***(mandatory)***

- `overwrite?`, an option to overwrite existing ids:
`boolean`
*(defaults to `false`)*

- `test?`, a node-matcher provided to [`hast-util-is-element`][Hast Matcher]:
[`Test`][Hast Matcher - Test]
*(defaults to heading elements)*

- `uniqueifier?`, a function, which makes a generated slug more unique:
`(slug: string, instance: number, textContent: string, node: Rehype.Element) => string`
*(defaults to `${ slug }-${ instance }`)*

## Building

This project is powered by TypeScript and features JSDoc-comments.
Since we need regular old JavaScript, a build-process is provided to compile
the code:

First clone the repo...
```sh
git clone https://gitlab.com/tinnedtea/rehype-slug.git && \
	cd ./rehype-slug
```

...then install the dependencies...
```sh
npm ci
```

... and finally build the package.
```sh
npm run build
```

And voilá, a `build` folder popped up with the compiled JavaScript! 
The `rehype-slug` directory is now ready to be pushed to a registry.

## Contributing

We are in open-source-land after all, aren't we?

You are free to suggest changes and report issues by any means
comfortable - may it be the repos issue-tracker, an [email] or a 
note on my fridge. As to repos, all of my projects have mirrors,
while the original is always hosted on [GitLab]. If you want something
more libre or mainstream, head to [Codeberg] or [GitHub] respectively.

I accept issue-reports and pull-requests on all platforms (this may
change as projects grow, I can only handle so many different types
of notifications, you know).

## Licence

This plugin is licensed under the **GNU General Public License v3.0 only**.  
The complete licence is provided in [`./licence`][Licence].


[^Registries]: You may also want to use an alternate npm-registry. My 
packages are also published to [GitLab], [Codeberg] and [GitHub],
just follow a link, navigate to packages and follow the provided
instructions.

[Codeberg]: https://codeberg.org/tinnedtea/rehype-slug
[GitHub]: https://github.com/tinnedtea/rehype-slug
[GitLab]: https://gitlab.com/tinnedtea/rehype-slug
[Email]: mailto:mail@tinnedtea.com
[Hast Matcher]: https://github.com/syntax-tree/hast-util-is-element
[Hast Matcher - Test]: https://github.com/syntax-tree/hast-util-is-element/blob/2350475803dab89e5be54f6937a279259c62bcb8/index.js#L7
[Licence]: ./licence
[Package]: https://npmjs.com/package/@tinnedtea/rehype-slug
[Rehype]: https://github.com/rehypejs/rehype
[Rehype Slug]: https://github.com/rehypejs/rehype-slug
