import { createDom } from '@purestack/ts-minidom'
import { styleBuilder } from '@purestack/ts-style'
import { beforeEach, describe, expect, it } from 'vitest'
import { registerTabsStyles } from './tabsStyle'

function tabsOwnerId(control: Element) {
  let parent = control.parentElement
  while (parent) {
    if (parent.classList.contains('tabs')) return parent.id
    parent = parent.parentElement
  }
}

describe('nested Tabs responsive styles', () => {
  beforeEach(() => {
    styleBuilder.reset()
  })

  it.each(['light', 'dark'] as const)(
    'keeps a compact parent from changing its nested controls in the %s theme',
    (theme) => {
      const cleanup = createDom(`<html><body>
        <section id="outer" class="tabs tabs--enhanced tabs--compact">
          <div class="tabs__tabs-row"></div>
          <div class="tabs__select-wrap"></div>
          <div class="tabs__list"><div class="tabs__item">
            <label class="tabs__tab">Outer tab</label>
            <section class="tabs__panel">
              <section id="inner" class="tabs tabs--enhanced" data-mobile-select="false">
                <div class="tabs__tabs-row"></div>
                <div class="tabs__select-wrap"></div>
                <div class="tabs__list"><div class="tabs__item">
                  <label class="tabs__tab">Inner tab</label>
                </div></div>
              </section>
              <section id="static" class="tabs">
                <div class="tabs__list"><div class="tabs__item">
                  <label class="tabs__tab">Static fallback tab</label>
                </div></div>
              </section>
            </section>
          </div></div>
        </section>
      </body></html>`)
      try {
        registerTabsStyles()
        const rules = [...styleBuilder.get(theme).children.values()]
        const compactRules = rules.filter((rule) =>
          rule.selector.includes('.tabs--compact'),
        )
        expect(compactRules.length).toBeGreaterThan(0)
        for (const rule of compactRules) {
          const matched = [...document.querySelectorAll(rule.selector)]
          expect(matched.length).toBeGreaterThan(0)
          for (const control of matched) {
            expect(tabsOwnerId(control)).toBe('outer')
          }
        }

        const labelRule = rules.find(
          (rule) =>
            rule.selector.includes('.tabs--enhanced') &&
            rule.selector.endsWith('.tabs__tab'),
        )
        expect(labelRule).toBeDefined()
        const labels = [...document.querySelectorAll(labelRule?.selector ?? '')]
        expect(labels).toHaveLength(2)
        expect(labels.map(tabsOwnerId)).toEqual(['outer', 'inner'])
      } finally {
        cleanup()
      }
    },
  )
})
