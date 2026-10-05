import { parseHtml, resetMiniDomCaches } from './minidom'

const DOM_GLOBAL_KEYS = [
  'window',
  'document',
  'Node',
  'Element',
  'HTMLElement',
  'HTMLSlotElement',
  'DocumentFragment',
  'CustomEvent',
  'Event',
  'MouseEvent',
  'MutationObserver',
  'Comment',
  'Text',
  'HTMLTemplateElement',
  'CSS',
  'localStorage',
  'sessionStorage',
] as const

type DomGlobals = Partial<Record<(typeof DOM_GLOBAL_KEYS)[number], unknown>>

/**
 * Keeps a value for a call and everything it awaits. Node's
 * `AsyncLocalStorage` is one.
 */
export interface AsyncScope {
  getStore(): unknown
  run<R>(store: unknown, callback: () => R): R
}

/** The current render's DOM, found through the scope `useDomScope` set. */
let domScope: AsyncScope = createSequentialScope()
/** The DOM that code outside `runInDom` sees, installed by `createDom`. */
let processDom: DomGlobals = {}
let globalsInstalled = false

/**
 * Sets how `runInDom` keeps each render's DOM. With an async scope, such as
 * Node's `AsyncLocalStorage`, renders can overlap. Without one, a render's
 * DOM stays current until it finishes, so renders must run one at a time.
 * Returns a function that restores the previous scope.
 */
export function useDomScope(scope: AsyncScope): () => void {
  const previous = domScope
  domScope = scope
  return () => {
    domScope = previous
  }
}

/**
 * Runs `render` with its own DOM, parsed from `html`. The DOM globals point
 * at it for `render` and everything it awaits, and return to the process DOM
 * when it finishes. It returns what `render` returns, a promise included.
 */
export function runInDom<T>(
  html: string,
  render: (document: Document) => T,
): T {
  installDomGlobals()
  const dom = createDomGlobals(html)
  return domScope.run(dom, () => render(dom.document as Document))
}

/**
 * Installs a DOM for the whole process, for code that runs outside a render,
 * such as component tests. Returns a function that restores the previous one.
 */
export function createDom(html: string): () => void {
  installDomGlobals()
  const previous = processDom
  processDom = createDomGlobals(html)
  return () => {
    processDom = previous
    resetMiniDomCaches()
  }
}

export function ensureDomGlobals(): () => void {
  const globals = globalThis
  if (globals.document && globals.window) return () => {}
  return createDom('<html><body></body></html>')
}

function createDomGlobals(html: string): DomGlobals {
  const window = parseHtml(html).window as Record<string, unknown>
  return Object.fromEntries(DOM_GLOBAL_KEYS.map((key) => [key, window[key]]))
}

function currentDom() {
  return (domScope.getStore() as DomGlobals | undefined) ?? processDom
}

/**
 * Turns each DOM global into an accessor that reads the current render's DOM
 * inside `runInDom`, and the process DOM everywhere else.
 */
function installDomGlobals() {
  if (globalsInstalled) return
  globalsInstalled = true
  const globals = globalThis as Record<string, unknown>
  for (const key of DOM_GLOBAL_KEYS) {
    processDom[key] = globals[key]
    Object.defineProperty(globals, key, {
      configurable: true,
      get: () => currentDom()[key],
      set: (value: unknown) => {
        currentDom()[key] = value
      },
    })
  }
}

/**
 * The scope used until `useDomScope` sets another: the store stays current
 * from the start of `run` until its callback, or the promise it returns,
 * finishes. Nested runs work; overlapping ones would share the latest store.
 */
function createSequentialScope(): AsyncScope {
  let current: unknown
  return {
    getStore: () => current,
    run<R>(store: unknown, callback: () => R): R {
      const previous = current
      current = store
      const restore = () => {
        current = previous
      }
      let result: R
      try {
        result = callback()
      } catch (error) {
        restore()
        throw error
      }
      if (result instanceof Promise) return result.finally(restore) as R
      restore()
      return result
    },
  }
}
