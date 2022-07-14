import { writeFileSync } from 'fs'
import { allCoreContent } from 'pliny/utils/contentlayer.mjs'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

writeFileSync('public/search.json', JSON.stringify(allCoreContent(allBlogs)))
