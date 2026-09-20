import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadOpenSourceProjects } from './open-source.ts'

const watch = ['../../../open-source/*/*.md']

export function resolveOpenSourceDocsRoot(moduleUrl: string): string {
  return resolve(dirname(fileURLToPath(moduleUrl)), '../../../')
}

export function createOpenSourceDataLoader(rootDir: string) {
  return {
    watch,
    load() {
      return loadOpenSourceProjects(rootDir)
    },
  }
}

export default createOpenSourceDataLoader(
  resolveOpenSourceDocsRoot(import.meta.url),
)
