import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { loadOpenSourceProjects } from '../docs/.vitepress/theme/data/open-source.ts'
import openSourceLoader from '../docs/.vitepress/theme/data/open-source.data.ts'

function addProject(docsRoot, directoryName, frontmatter, notes = []) {
  const projectDir = join(docsRoot, 'open-source', directoryName)
  mkdirSync(projectDir, { recursive: true })
  writeFileSync(
    join(projectDir, 'index.md'),
    `---\n${frontmatter}\n---\n\n# Project notes\n`,
  )

  for (const note of notes) {
    writeFileSync(join(projectDir, note), '# Note\n')
  }
}

test('loads projects with stable order, safe defaults, note counts, and directory links', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'open-source-data-'))
  const docsRoot = join(tempRoot, 'docs')

  try {
    addProject(
      docsRoot,
      '03-Gamma',
      'name: Gamma Project\nsummary: Later project\norder: 20\nstatus: completed\nstack:\n  - TypeScript',
      ['notes.md'],
    )
    addProject(
      docsRoot,
      '02-Beta',
      'name: Alpha Project\nsummary: Second tie\norder: 10\nstatus: learning',
      ['progress.md'],
    )
    addProject(
      docsRoot,
      '01-Alpha',
      'name: Zulu Project\nsummary: First tie\norder: 10\nstatus: unknown',
      ['first.md', 'second.md', 'diagram.svg'],
    )

    const projects = loadOpenSourceProjects(docsRoot)

    assert.deepEqual(
      projects.map(({ link }) => link),
      ['/open-source/01-Alpha/', '/open-source/02-Beta/', '/open-source/03-Gamma/'],
    )
    assert.deepEqual(
      projects.map(({ order }) => order),
      [10, 10, 20],
    )
    assert.equal(projects[0].noteCount, 2)
    assert.equal(projects[0].status, 'paused')
    assert.equal(projects[0].statusLabel, '暂停')
    assert.deepEqual(projects[0].stack, [])
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('VitePress loader watches project markdown and delegates to the pure data function', async () => {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../docs')

  assert.deepEqual(openSourceLoader.watch, ['../../../open-source/*/*.md'])
  assert.deepEqual(
    await openSourceLoader.load(),
    loadOpenSourceProjects(docsRoot),
  )
})
