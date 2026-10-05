import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'

import { transformWithEsbuild } from 'vite'

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(SCRIPT_DIRECTORY, '..')
const MANIFEST_PATH = join(PROJECT_ROOT, 'docs', '.vitepress', 'config', 'java-course.ts')
const REDIRECTS_PATH = join(PROJECT_ROOT, 'docs', '.vitepress', 'data', 'java-redirects.json')
const PUBLIC_DIRECTORY = join(PROJECT_ROOT, 'docs', 'public')
const COURSE_ROUTE_PREFIX = '/courses/java/'

function fail(message) {
  throw new Error(`Invalid Java redirect map: ${message}`)
}

function assertSafeRoute(route, label, { allowEscapableCharacters = false } = {}) {
  if (typeof route !== 'string' || route.length === 0) {
    fail(`${label} must be a non-empty string`)
  }
  if (route !== route.trim()) {
    fail(`${label} must not contain leading or trailing whitespace`)
  }
  if (!route.startsWith(COURSE_ROUTE_PREFIX)) {
    fail(`${label} must stay under ${COURSE_ROUTE_PREFIX}`)
  }
  if (route.includes('\\') || route.includes('%') || /[?#]/u.test(route)) {
    fail(`${label} contains an unsafe URL boundary`)
  }
  if (/[/\\.]\.\.?[/\\]/u.test(route) || route.endsWith('/.') || route.endsWith('/..')) {
    fail(`${label} contains a path traversal segment`)
  }
  if (/\u0000|[\u0001-\u001f\u007f]/u.test(route)) {
    fail(`${label} contains a control character`)
  }
  if (!allowEscapableCharacters && /[&<>"']/u.test(route)) {
    fail(`${label} contains an unescaped HTML or JavaScript delimiter`)
  }

  const segments = route.split('/')
  if (segments.length < 4 || segments.some((segment, index) => index > 0 && segment.length === 0)) {
    fail(`${label} must identify a concrete course article`)
  }
  if (segments.slice(1).some((segment) => segment === '.' || segment === '..')) {
    fail(`${label} contains a path traversal segment`)
  }
  return route
}

function normalizeEntries(entries) {
  if (Array.isArray(entries)) return entries
  if (entries && typeof entries === 'object') {
    if ('source' in entries || 'target' in entries) return [entries]
    return Object.entries(entries).map(([source, target]) => ({ source, target }))
  }
  fail('entries must be an array or a source-to-target object')
}

/**
 * Validate a redirect map against the canonical Java route set.
 *
 * Returning a fresh array lets the generator use the exact validated data
 * without mutating the parsed JSON input.
 */
export function validateRedirects(entries, canonicalRoutes) {
  if (!canonicalRoutes || typeof canonicalRoutes[Symbol.iterator] !== 'function') {
    fail('canonicalRoutes must be an iterable route set')
  }

  const canonical = new Set(canonicalRoutes)
  const seenSources = new Set()
  const normalized = []

  for (const [index, entry] of normalizeEntries(entries).entries()) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      fail(`entry ${index} must contain source and target`)
    }

    const source = assertSafeRoute(entry.source, `entry ${index} source`)
    const target = assertSafeRoute(entry.target, `entry ${index} target`)
    if (seenSources.has(source)) {
      fail(`duplicate source ${source}`)
    }
    if (canonical.has(source)) {
      fail(`source ${source} collides with a canonical route`)
    }
    if (!canonical.has(target)) {
      fail(`target ${target} does not exist in the canonical manifest`)
    }

    seenSources.add(source)
    normalized.push({ source, target })
  }

  return normalized
}

function encodeTargetRoute(targetRoute) {
  assertSafeRoute(targetRoute, 'target', { allowEscapableCharacters: true })
  try {
    return encodeURI(targetRoute)
  } catch (error) {
    throw new Error(`Invalid Java redirect map: target cannot be URI encoded (${error.message})`, {
      cause: error,
    })
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/gu, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function escapeJavaScriptString(value) {
  return JSON.stringify(value)
    .replace(/</gu, '\\u003C')
    .replace(/>/gu, '\\u003E')
    .replace(/&/gu, '\\u0026')
    .replace(/\u2028/gu, '\\u2028')
    .replace(/\u2029/gu, '\\u2029')
}

/** Render a static, client-side compatibility page for one canonical route. */
export function renderRedirectHtml(targetRoute) {
  const encodedTarget = encodeTargetRoute(targetRoute)
  const escapedTarget = escapeHtml(encodedTarget)
  const javaScriptTarget = escapeJavaScriptString(encodedTarget)

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <link rel="canonical" href="${escapedTarget}">
  <meta http-equiv="refresh" content="0; url=${escapedTarget}">
  <title>页面已移动</title>
  <script>location.replace(${javaScriptTarget});</script>
</head>
<body>
  <p>页面已移动，请访问 <a href="${escapedTarget}">${escapedTarget}</a>。</p>
</body>
</html>
`
}

async function loadCanonicalRoutes() {
  const source = await readFile(MANIFEST_PATH, 'utf8')
  const transformed = await transformWithEsbuild(source, MANIFEST_PATH, {
    format: 'esm',
    loader: 'ts',
    target: 'node22',
  })
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(transformed.code).toString('base64')}`
  const manifest = await import(moduleUrl)
  return new Set(
    manifest.JAVA_COURSE_CHAPTERS.flatMap((chapter) =>
      chapter.articles.map((article) => article.route),
    ),
  )
}

function outputPathForSource(source) {
  assertSafeRoute(source, 'source')
  const pathParts = source.slice(1).split('/')
  const outputPath = resolve(PUBLIC_DIRECTORY, ...pathParts, 'index.html')
  const publicRoot = resolve(PUBLIC_DIRECTORY)
  const relativeOutput = relative(publicRoot, outputPath)
  if (isAbsolute(relativeOutput) || relativeOutput === '..' || relativeOutput.startsWith(`..${sep}`)) {
    fail(`source ${source} escapes docs/public`)
  }
  return outputPath
}

export async function generateRedirects({
  redirectsPath = REDIRECTS_PATH,
  publicDirectory = PUBLIC_DIRECTORY,
} = {}) {
  const entries = JSON.parse(await readFile(redirectsPath, 'utf8'))
  const canonicalRoutes = await loadCanonicalRoutes()
  const validated = validateRedirects(entries, canonicalRoutes)
  const generatedFiles = []

  for (const entry of validated) {
    const outputPath = outputPathForSource(entry.source)
    const outputRelativeToPublic = relative(PUBLIC_DIRECTORY, outputPath)
    const outputPathForRun = publicDirectory === PUBLIC_DIRECTORY
      ? outputPath
      : resolve(publicDirectory, outputRelativeToPublic)
    const html = renderRedirectHtml(entry.target)
    try {
      const existing = await readFile(outputPathForRun, 'utf8')
      if (existing !== html) {
        fail(`refusing to overwrite an existing file at ${outputPathForRun}`)
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    await mkdir(dirname(outputPathForRun), { recursive: true })
    await writeFile(outputPathForRun, html, 'utf8')
    generatedFiles.push(outputPathForRun)
  }

  console.log(`Generated ${validated.length} Java compatibility redirect pages.`)
  return { count: validated.length, files: generatedFiles }
}

const isMainModule = process.argv[1]
  && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  try {
    await generateRedirects()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
