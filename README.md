# Pliny

**Note: Pliny is currently in alpha. Expect breaking changes.**

Pliny makes creating, editing and publishing markdown content easy and simple. It is based on [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) and [Contentlayer](https://github.com/contentlayerdev/contentlayer).

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

## Features

- Best in class developer experience for building a markdown website, courtesy of contentlayer, including:
  - Live reload on content changes
  - Fast and incremental builds
  - Simple but powerful schema DSL to design your content model (validates your content and generates types)
  - Auto-generated TypeScript types based on your content model (e.g. frontmatter or CMS schema)
- Out of the box templates based on Next.js and Tailwindcss
- Full suite of markdown plugins including
  - Server-side syntax highlighting with line numbers and line highlighting via [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus)
  - Math display supported via [KaTeX](https://katex.org/)
  - Citation and bibliography support via [rehype-citation](https://github.com/timlrx/rehype-citation)
- React components for common services
  - Newsletter (Buttondown, Convertkit, Email Octopus, Klaviyo, Mailchimp, Revue)
  - Analytics (Google Analytics, Plausible Analytics, Simple Analytics, Umami Analytics)
  - Comment system (Disqus, Giscus, Utterances)
