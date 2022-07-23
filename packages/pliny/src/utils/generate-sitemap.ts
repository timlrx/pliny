import { writeFileSync } from 'fs'
import globby from 'globby'
import prettier from 'prettier'
import { MDXDocument } from './contentlayer'

async function generateSitemap(siteUrl: string, allContents: MDXDocument[]) {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  const contentPages = allContents
    .filter((x) => !x.draft && !x.canonicalUrl)
    .map((x) => `/${x._raw.flattenedPath}`)
  const pages = await globby([
    'pages/*.(js|tsx)',
    'public/tags/**/*.xml',
    '!pages/_*.(js|tsx)',
    '!pages/api',
    '!pages/404.(js|tsx)',
  ])

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .concat(contentPages)
              .map((page) => {
                const path = page
                  .replace('pages/', '/')
                  .replace('public/', '/')
                  .replace(/.js|.tsx|.mdx|.md/g, '')
                  .replace('/feed.xml', '')
                const route = path === '/index' ? '' : path
                return `
                        <url>
                            <loc>${siteUrl}${route}</loc>
                        </url>
                    `
              })
              .join('')}
        </urlset>
    `

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  writeFileSync('public/sitemap.xml', formatted)
}

export default generateSitemap
