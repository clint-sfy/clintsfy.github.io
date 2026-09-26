import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sidebar } from '../docs/.vitepress/config/sidebar.ts'

function collectLinkedItems(items, result = []) {
  for (const item of items ?? []) {
    if (item.link) result.push(item)
    collectLinkedItems(item.items, result)
  }
  return result
}

test('sidebar link labels use inline markup inside VitePress text elements', () => {
  const linkedItems = Object.values(sidebar).flatMap((items) => collectLinkedItems(items))

  assert.ok(linkedItems.length > 0, 'sidebar should expose linked document items')
  for (const item of linkedItems) {
    assert.doesNotMatch(
      item.text,
      /<div\b/i,
      `sidebar label for ${item.link} must not put a block element inside VitePress <p class="text">`,
    )
  }
})
