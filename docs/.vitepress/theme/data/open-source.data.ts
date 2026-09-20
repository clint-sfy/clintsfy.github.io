import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadOpenSourceProjects } from './open-source.ts'

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../')

export default {
  watch: ['../../../open-source/*/*.md'],
  load() {
    return loadOpenSourceProjects(docsRoot)
  },
}
