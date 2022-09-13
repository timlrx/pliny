import { slug } from 'github-slugger'

export const kebabCase = (str: string) => slug(str)
