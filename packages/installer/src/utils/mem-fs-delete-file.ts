import { Store } from 'mem-fs'

/**
 * Using the deleteFile directory to work around all the glob matching
 * https://github.com/SBoudrias/mem-fs-editor/blob/master/lib/actions/delete.js#L9
 *
 * @param {string} path
 * @param {Store} store
 */
export function deleteFile(path: string, store: Store) {
  const file = store.get(path)
  file['state'] = 'deleted'
  file.contents = null
  store.add(file)
}
