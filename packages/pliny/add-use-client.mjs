import fs from 'fs'
import globby from 'globby'

// Append "use client" to all path chunks that contain "use" hooks
// So these packages can be directly used in Next.js directly
// This allows us to see support file splitting with easy next import
;(async () => {
  console.log('Added use client directive to the following files:')
  const chunkPaths = await globby('chunk*')
  for (const path of chunkPaths) {
    const data = fs.readFileSync(path, 'utf8')
    if (
      /useState|useEffect|useRef|useCallback|useContext|useMemo|useTheme|useRouter|useRegisterActions|useMatches|useKBar/.test(
        data
      )
    ) {
      console.log(path)
      const insert = Buffer.from('"use client"\n')
      fs.writeFileSync(path, insert + data)
    }
  }
  // Handle ui differently as they are not split
  const clientPaths = await globby([
    'ui/NewsletterForm.js',
    'ui/BlogNewsletterForm.js',
    'ui/Pre.js',
    'search/KBarButton.js',
    'search/AlgoliaButton.js',
  ])
  for (const path of clientPaths) {
    console.log(path)
    const data = fs.readFileSync(path)
    const insert = Buffer.from('"use client"\n')
    fs.writeFileSync(path, insert + data)
  }
})()
