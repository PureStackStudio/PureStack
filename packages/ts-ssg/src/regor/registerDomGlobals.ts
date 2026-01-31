import cssEscape from 'css.escape'

type GlobalKey =
  | 'window'
  | 'document'
  | 'Node'
  | 'Element'
  | 'HTMLElement'
  | 'DocumentFragment'
  | 'CustomEvent'
  | 'Event'
  | 'Comment'
  | 'Text'
  | 'HTMLTemplateElement'
  | 'CSS'

export function registerDomGlobals(
  window: unknown,
  document: unknown,
): () => void {
  const globals = globalThis as Record<string, unknown>
  const original: Partial<Record<GlobalKey, unknown>> = {}
  const keys: GlobalKey[] = [
    'window',
    'document',
    'Node',
    'Element',
    'HTMLElement',
    'DocumentFragment',
    'CustomEvent',
    'Event',
    'Comment',
    'Text',
    'HTMLTemplateElement',
    'CSS',
  ]

  for (const key of keys) original[key] = globals[key]

  const win = window as Record<string, unknown>
  globals.window = window
  globals.document = document
  globals.Node = win.Node
  globals.Element = win.Element
  globals.HTMLElement = win.HTMLElement
  globals.DocumentFragment = win.DocumentFragment
  globals.CustomEvent = win.CustomEvent
  globals.Event = win.Event
  globals.Comment = win.Comment
  globals.Text = win.Text
  globals.HTMLTemplateElement = win.HTMLTemplateElement

  const windowCss = win.CSS as { escape?: unknown } | undefined
  globals.CSS =
    windowCss && typeof windowCss.escape === 'function'
      ? windowCss
      : { escape: cssEscape }

  return () => {
    for (const key of keys) globals[key] = original[key]
  }
}
