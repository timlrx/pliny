# `cli`

Command-line utility for initializing a new pliny app, code generation, content management, and other functions. It is meant to be user-friendly and easy to extend.

## Installation

```bash
npm i -g @pliny/cli
```

## Usage

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

## Credits

Adapted from [Blitz.js installer](https://github.com/blitz-js/blitz)
