import generateRss from 'pliny/utils/generate-rss.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.json'

generateRss(siteMetadata, allBlogs)
