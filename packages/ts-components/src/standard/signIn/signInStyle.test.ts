import { styleBuilder } from '@purestack/ts-style'
import { beforeEach, describe, expect, it } from 'vitest'
import { registerSignInStyles } from './signInStyle'

describe('SignIn styles', () => {
  beforeEach(() => {
    styleBuilder.reset()
  })

  it('targets signed-in state on the document root', async () => {
    registerSignInStyles()

    const css = await styleBuilder.render('light')

    expect(css).toContain(':scope.signed-in .sign-in__signed-out-view')
    expect(css).toContain(':scope.signed-in .sign-in__signed-in-view')
    expect(css).toContain(':scope.signed-in .sign-in__signed-out-action')
    expect(css).toContain(':scope.signed-in .sign-in__signed-in-action')
    expect(css).not.toContain(', .signed-in .sign-in__signed-out-view')
  })
})
