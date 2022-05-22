import generateSitemap from 'pliny/utils/generate-sitemap.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.json'

generateSitemap(siteMetadata.siteUrl, allBlogs)
