import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineIconComponents } from '../icon/icon'
import { defineBtnGroupComponents } from './btnGroup'

function renderBtnGroup(markup: string) {
  const cleanup = ensureDomGlobals()
  const html = renderApp(markup, {
    components: {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
      ...defineBtnGroupComponents(),
    },
    context: createTestContext(),
  })
  cleanup()
  return html
}

describe('Button group rendering', () => {
  it('renders grouped actions without proxy item components', () => {
    const html = renderBtnGroup(`<BtnGroup>
      <Btn>Save</Btn>
      <BtnLink href="./docs">Docs</BtnLink>
    </BtnGroup>`)

    expect(html).toContain('class="btn-group"')
    expect(html).toContain('<button')
    expect(html).toContain('<a')
    expect(html).toContain('<span class="btn__label">Save</span>')
    expect(html).toContain('href="/docs"')
  })

  it('renders a native dropdown menu with default trigger affordance', () => {
    const html = renderBtnGroup(`<BtnGroupDropDown>
      <Btn>Archive</Btn>
      <div class="custom-row">Custom</div>
    </BtnGroupDropDown>`)

    expect(html).toContain('<details')
    expect(html).toContain('class="btn-group__dropdown')
    expect(html).toContain('data-menu-runtime')
    expect(html).toContain('<summary')
    expect(html).toContain('class="btn btn-group__toggle')
    expect(html).toContain('<span class="btn__label">More</span>')
    expect(html).toContain('class="icon btn__icon"')
    expect(html).toContain('class="btn-group__menu')
    expect(html).toContain('<span class="btn__label">Archive</span>')
    expect(html).toContain('class="custom-row"')
  })

  it('supports icon-only dropdown triggers with accessible labels', () => {
    const html = renderBtnGroup(
      `<BtnGroupDropDown iconOnly="true" ariaLabel="More actions">
        <Btn>Delete</Btn>
      </BtnGroupDropDown>`,
    )

    expect(html).toContain('btn--icon-only')
    expect(html).toContain('aria-label="More actions"')
    expect(html).toContain('class="icon btn__icon"')
    expect(html).not.toContain('<span class="btn__label">More</span>')
  })

  it('applies group, trigger, and menu presentation props', () => {
    const html = renderBtnGroup(`<BtnGroup align="end" wrap="true">
      <BtnGroupDropDown
        align="start"
        label="Actions"
        iconPosition="start"
        tone="neutral"
        size="lg"
        variant="outline"
        menuTone="danger"
        menuVariant="surface"
      >
        <Btn>Report</Btn>
      </BtnGroupDropDown>
    </BtnGroup>`)

    expect(html).toContain('btn-group--end')
    expect(html).toContain('btn-group--wrap')
    expect(html).toContain('btn-group__dropdown--start')
    expect(html).toContain('btn--lg')
    expect(html).toContain('btn--icon-start')
    expect(html).toContain('tone--neutral')
    expect(html).toContain('<span class="btn__label">Actions</span>')
    expect(html).toContain('tone--danger')
    expect(html).toContain('tone-fill-surface')
  })

  it('keeps dropdown content open to links and arbitrary markup', () => {
    const html = renderBtnGroup(`<BtnGroup>
      <Btn>Default</Btn>
      <BtnGroupDropDown label="More actions">
        <BtnLink href="./settings">Settings</BtnLink>
        <section class="menu-extra"><strong>Advanced</strong></section>
      </BtnGroupDropDown>
    </BtnGroup>`)

    expect(html).toContain('<span class="btn__label">Default</span>')
    expect(html).toContain('href="/settings"')
    expect(html).toContain('<span class="btn__label">Settings</span>')
    expect(html).toContain('<section class="menu-extra">')
    expect(html).toContain('<strong>Advanced</strong>')
  })
})
