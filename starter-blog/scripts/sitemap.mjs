import generateSitemap from 'pliny/utils/generate-sitemap.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

generateSitemap(siteMetadata.siteUrl, allBlogs)
