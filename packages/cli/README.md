# `cli`

Command-line utility for initializing a new pliny app, code generation, content management, and other functions. It is meant to be user-friendly and easy to extend.

## Installation

```bash
npm i -g pliny
```

## Usage

Here are some examples of common commands:

### Create a new starter blog project called "my-blog"

```bash
pliny new starter-blog my-blog
```

### Add a blog content type, "blog", to an existing Next.js application in a folder called "data"

```bash
pliny install add-blog ContentDir=data ContentName=blog
```

## Credits

Adapted from [Blitz.js installer](https://github.com/blitz-js/blitz)
