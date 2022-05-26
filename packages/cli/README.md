# `cli`

Command-line utility for initializing a new pliny app, code generation, content management, and other functions. It is meant to be user-friendly and easy to extend.

## Installation

```bash
npm i -g @pliny/cli
```

## CLI Usage

Here are some examples of common commands:

### Create a new starter blog project called "my-blog"

```bash
pliny new --template=starter-blog my-blog
```

### Adding a blog page to an existing Next.js application:

```bash
pliny install add-blog ContentDir=data ContentName=blog
```

### Add the blog-classic templates to the `layouts` folder:

```bash
pliny install add-classic
```

## Generator

Templating and code generation is supported with a modified version of `@blitzjs/generator`. In the `generators` directory you'll find the base `generator` class and other files that extend it. The subclasses aren't terribly interesting, most of the fun happens in the abstract parent class.

Recipes are passed through the generator and transformed accordingly. This relies on a custom templating language. Each variable in a recipe template surrounded by `__` (e.g. `__modelName__`) will be replaced with the corresponding value in the object returned from `Generator::getTemplateValues`. This type of replacement works in filenames as well. This allows CLI inputs to replace placeholder variables. For an example, see `recipes/add-blog`.

The generator framework also supports conditional code generation, similar to other common templating languages like handlebars. All model variables are exposed via `process.env` and can be used in conditional statements. The generator will not evaluate any expressions in the conditional, so the condition must be evaluated in the generator class and passed as a variable to the template. Both `if else` and ternary statements are supported, and for `if` statements no `else` is required:

```js
// VALID
if (process.env.someCondition) {
  console.log('condition was true')
}

// VALID
if (process.env.someCondition) {
  console.log('condition was true')
} else {
  console.log('condition was false')
}

// VALID
const action = process.env.someCondition
  ? () => console.log('condition was true')
  : () => console.log('condition was false')

// **NOT** VALID
// This will compile fine, but will not product the expected results.
// The template argument `someValue` will be evaluated for truthiness
// and the conditional will be evaluated based on that, regardless of
// the rest of the expression
if (process.env.someValue === 'some test') {
  console.log('dynamic condition')
}
```

## Credits

Much credit goes to [Blitzjs](https://github.com/blitz-js/blitz) of which this code is adapted from.

CLI is adapted from @blitzjs/cli, templating and generator adapted from @blitzjs/generator.
