import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { transformWithEsbuild } from 'vite'

export async function load(url, context, nextLoad) {
  if (!url.endsWith('.ts')) {
    return nextLoad(url, context)
  }

  const filePath = fileURLToPath(url)
  const source = await readFile(filePath, 'utf8')
  const transformed = await transformWithEsbuild(source, filePath, { loader: 'ts' })

  return {
    format: 'module',
    source: transformed.code,
    shortCircuit: true,
  }
}
