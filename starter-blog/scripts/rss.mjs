import generateRss from 'pliny/utils/generate-rss.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

generateRss(siteMetadata, allBlogs)
