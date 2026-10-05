import { styleBuilder } from '@purestack/ts-style'
import { beforeEach, describe, expect, it } from 'vitest'
import { registerSignInStyles } from './signInStyle'

describe('SignIn styles', () => {
  beforeEach(() => {
    styleBuilder.reset()
  })

  it('uses the document auth state while allowing per-instance overrides', async () => {
    registerSignInStyles()

    const css = (await styleBuilder.render('light')).replace(/\s+/g, ' ')

    for (const part of [
      'signed-out-view',
      'signed-in-view',
      'signed-out-action',
      'signed-in-action',
    ]) {
      expect(css).toContain(
        `:scope.signed-in .sign-in:not([data-signed-in="false"]) .sign-in__${part}`,
      )
      expect(css).toContain(`.sign-in[data-signed-in="true"] .sign-in__${part}`)
    }
    expect(css).not.toContain(', .signed-in .sign-in__signed-out-view')
  })
})
