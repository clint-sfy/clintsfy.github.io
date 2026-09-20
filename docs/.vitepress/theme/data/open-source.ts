import { readdirSync, readFileSync } from 'node:fs'
import type { Dirent } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

export type ProjectStatus = 'learning' | 'completed' | 'paused'

export interface OpenSourceProject {
  name: string
  summary: string
  repo?: string
  stack: string[]
  status: ProjectStatus
  statusLabel: string
  noteCount: number
  link: string
  order: number
}

const statusLabels: Record<ProjectStatus, string> = {
  learning: '学习中',
  completed: '已完成',
  paused: '暂停',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  )
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

function readStack(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function readStatus(value: unknown): ProjectStatus {
  return value === 'learning' || value === 'completed' || value === 'paused'
    ? value
    : 'paused'
}

function readOrder(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function countNotes(projectDir: string): number {
  return readdirSync(projectDir, { withFileTypes: true }).filter(
    (entry) =>
      entry.isFile() &&
      entry.name.toLowerCase().endsWith('.md') &&
      entry.name.toLowerCase() !== 'index.md',
  ).length
}

export function loadOpenSourceProjects(rootDir: string): OpenSourceProject[] {
  const projectsDir = join(rootDir, 'open-source')
  let projectDirectories: Dirent[]

  try {
    projectDirectories = readdirSync(projectsDir, { withFileTypes: true }).filter(
      (entry) => entry.isDirectory(),
    )
  } catch (error) {
    if (isNotFound(error)) return []
    throw error
  }

  const projects: Array<{
    directoryName: string
    project: OpenSourceProject
  }> = []

  for (const directory of projectDirectories) {
    const projectDir = join(projectsDir, directory.name)
    const indexPath = join(projectDir, 'index.md')
    let markdown: string

    try {
      markdown = readFileSync(indexPath, 'utf8')
    } catch (error) {
      if (isNotFound(error)) continue
      throw error
    }

    let frontmatter: Record<string, unknown> = {}

    try {
      const parsed = matter(markdown).data
      if (isRecord(parsed)) frontmatter = parsed
    } catch {
      // Keep malformed frontmatter from preventing the rest of the index from loading.
    }

    const status = readStatus(frontmatter.status)
    const name = readString(frontmatter.name, directory.name)

    projects.push({
      directoryName: directory.name,
      project: {
        name: name.trim().length > 0 ? name : directory.name,
        summary: readString(frontmatter.summary),
        repo: readOptionalString(frontmatter.repo),
        stack: readStack(frontmatter.stack),
        status,
        statusLabel: statusLabels[status],
        noteCount: countNotes(projectDir),
        link: `/open-source/${directory.name}/`,
        order: readOrder(frontmatter.order),
      },
    })
  }

  return projects
    .sort((left, right) => {
      const orderDifference = left.project.order - right.project.order
      if (orderDifference !== 0) return orderDifference
      if (left.directoryName < right.directoryName) return -1
      if (left.directoryName > right.directoryName) return 1
      return 0
    })
    .map(({ project }) => project)
}
