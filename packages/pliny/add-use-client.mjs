import fs from 'fs'
import globby from 'globby'

// Append "use client" to client side components
// So these packages can be directly used in Next.js directly
;(async () => {
  const clientPaths = await globby([
    'comments/Disqus.js',
    'comments/Giscus.js',
    'comments/Utterances.js',
    'search/Algolia.js',
    'search/KBar.js',
    'search/KBarModal.js',
    'search/KBarPortal.js',
    'ui/NewsletterForm.js',
    'ui/Pre.js',
  ])
  for (const path of clientPaths) {
    const data = fs.readFileSync(path)
    const fd = fs.openSync(path, 'w+')
    const insert = Buffer.from('"use client"\n')
    fs.writeSync(fd, insert, 0, insert.length, 0)
    fs.writeSync(fd, data, 0, data.length, insert.length)
    fs.close(fd, (err) => {
      if (err) throw err
    })
  }
})()
