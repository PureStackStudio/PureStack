import prettier from 'prettier'
import { describe, expect, it } from 'vitest'

import { s } from './s'

describe('keyframes', () => {
  it('renders unprefixed frames, preserves frame order, and puts definitions after selectors', async () => {
    const root = s('.notice')
    const frames = root.keyframes('fade-in')
    frames.select('from').opacity('0')
    frames.select('50%, 75.5%').opacity('.5').transform('scale(.9)')
    frames.select('to').opacity('1')
    root.animation('fade-in 160ms ease-out')

    const expected = `.notice {
  animation: fade-in 160ms ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  50%,
  75.5% {
    opacity: 0.5;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
  }
}
`
    const raw = root.toCSS()
    expect(raw).toContain('@keyframes fade-in {')
    expect(raw).toContain('50%, 75.5% {')
    expect(raw).not.toContain('.notice from')
    expect(raw).not.toContain('.notice @keyframes')
    expect(raw).toBe(root.toCSS())
    expect(await prettier.format(raw, { parser: 'css' })).toBe(expected)
    expect(await root.toPrettyCSS()).toBe(expected)
  })

  it('reuses blocks and frames without changing revisions until a value changes', () => {
    const root = s()
    const other = s()
    const otherRevision = other.revision
    const frames = root.keyframes(' fade-in ')
    const from = frames.select('from').opacity('0')
    const before = root.revision

    expect(root.keyframes('fade-in')).toBe(frames)
    expect(frames.select('from')).toBe(from)
    from.opacity('0')
    expect(root.revision).toBe(before)

    from.opacity('.2')
    expect(root.revision).toBeGreaterThan(before)
    expect(other.revision).toBe(otherRevision)
    expect(root.toCSS().match(/@keyframes fade-in/g)).toHaveLength(1)
    expect(root.toCSS().match(/from \{/g)).toHaveLength(1)
    expect(root.toCSS()).toContain('opacity: .2;')
  })

  it('rejects empty names without changing the tree', () => {
    const root = s()
    const before = root.revision
    for (const name of ['', '   ', '\n\t']) {
      expect(() => root.keyframes(name)).toThrow(
        'Keyframes name must be a non-empty string.',
      )
    }
    expect(root.revision).toBe(before)
    expect(root.toCSS()).toBe('')
  })

  it('keeps keyframes inside their scope and media blocks', async () => {
    const root = s().scope('.hero')
    root.keyframes('pulse').select('0%, 100%').opacity('1')
    root
      .media('prefers-reduced-motion: no-preference')
      .select('.packet')
      .keyframes('travel')
      .select('to')
      .set('offset-distance', '100%')

    expect(await root.toPrettyCSS()).toBe(`@scope (.hero) {
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    @keyframes travel {
      to {
        offset-distance: 100%;
      }
    }
  }
}
`)
  })

  it('supports hero motion paths, SVG strokes, grouped frames, and reduced motion', async () => {
    const root = s()
    root.select('.zt-write-packet').css({
      opacity: '0',
      'offset-path': "path('M64 102H118L180 138L280 154')",
      'offset-rotate': 'auto',
      animationName: 'zt-write-packet',
    })
    const packet = root.keyframes('zt-write-packet')
    packet.select('0%').css({ 'offset-distance': '0%', opacity: '0' })
    packet.select('3%').opacity('.9')
    packet.select('20%').css({ 'offset-distance': '100%', opacity: '.9' })
    packet.select('23%, 100%').css({ 'offset-distance': '100%', opacity: '0' })
    const trace = root.keyframes('zt-merge-trace')
    trace.select('0%, 34%').strokeDashoffset('1').opacity('0')
    trace.select('38%').opacity('.8')
    trace.select('56%').strokeDashoffset('0').opacity('.8')
    trace.select('64%, 100%').strokeDashoffset('0').opacity('0')
    root
      .select('.zt-engine .zt-motion')
      .media('prefers-reduced-motion: reduce')
      .animation('none !important')

    const expected = `.zt-write-packet {
  opacity: 0;
  offset-path: path('M64 102H118L180 138L280 154');
  offset-rotate: auto;
  animation-name: zt-write-packet;
}
@media (prefers-reduced-motion: reduce) {
  .zt-engine .zt-motion { animation: none !important; }
}
@keyframes zt-write-packet {
  0% { offset-distance: 0%; opacity: 0; }
  3% { opacity: .9; }
  20% { offset-distance: 100%; opacity: .9; }
  23%, 100% { offset-distance: 100%; opacity: 0; }
}
@keyframes zt-merge-trace {
  0%, 34% { stroke-dashoffset: 1; opacity: 0; }
  38% { opacity: .8; }
  56% { stroke-dashoffset: 0; opacity: .8; }
  64%, 100% { stroke-dashoffset: 0; opacity: 0; }
}
`
    expect((await root.toPrettyCSS()).replace(/\n\s*\n/g, '\n')).toBe(
      (await prettier.format(expected, { parser: 'css' })).replace(
        /\n\s*\n/g,
        '\n',
      ),
    )
  })
})
