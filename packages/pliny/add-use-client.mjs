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
    if (/useState|useEffect|useRef|useCallback|useMemo|useTheme|useRouter/.test(data)) {
      console.log(path)
      const insert = Buffer.from('"use client"\n')
      fs.writeFileSync(path, insert + data)
    }
  }
})()
