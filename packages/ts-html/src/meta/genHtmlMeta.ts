import fs from 'fs'
import prettier from 'prettier'
import { fileURLToPath } from 'url'

interface HtmlAttrDef {
  name: string
}
interface HtmlTagDef {
  name: string
  attributes: HtmlAttrDef[]
}
interface AriaDef {
  name: string
}
interface EventDef {
  name: string
}

async function main() {
  const tagsJson = fileURLToPath(
    new URL('./data/htmlTags.json', import.meta.url),
  )
  const globalsJson = fileURLToPath(
    new URL('./data/htmlGlobalAttributes.json', import.meta.url),
  )
  const ariaJson = fileURLToPath(
    new URL('./data/ariaSpec.json', import.meta.url),
  )
  const eventsJson = fileURLToPath(
    new URL('./data/htmlEvents.json', import.meta.url),
  )
  const outTs = fileURLToPath(new URL('../html.d.ts', import.meta.url))

  // load raw data
  const tags = JSON.parse(fs.readFileSync(tagsJson, 'utf-8')) as HtmlTagDef[]
  const globals = JSON.parse(
    fs.readFileSync(globalsJson, 'utf-8'),
  ) as HtmlAttrDef[]
  const aria = JSON.parse(fs.readFileSync(ariaJson, 'utf-8')) as AriaDef[]
  const events = JSON.parse(fs.readFileSync(eventsJson, 'utf-8')) as EventDef[]

  // dedupe
  const globalSet = new Set(globals.map((g) => g.name))
  const ariaSet = new Set(aria.map((a) => a.name))
  const eventSet = new Set(events.map((e) => e.name))

  // build literal unions
  const globalUnion = [...globalSet]
    .sort()
    .map((n) => `'${n}'`)
    .join(' |\n  ')
  const ariaUnion = [...ariaSet]
    .sort()
    .map((n) => `'${n}'`)
    .join(' |\n  ')
  const eventUnion = [...eventSet]
    .sort()
    .map((n) => `'${n}'`)
    .join(' |\n  ')

  // per-tag tag-specific-only union (or never)
  const specificEntries = tags
    .map((tag) => {
      const specific = tag.attributes
        .map((a) => a.name)
        .filter((n) => !globalSet.has(n) && !ariaSet.has(n) && !eventSet.has(n))
        .sort()
        .map((n) => `'${n}'`)

      const unionText =
        specific.length > 0 ? specific.join(' |\n    ') : 'never'

      return `'${tag.name}': ${unionText}`
    })
    .join(',\n')

  const code = `
/** All standard HTML global attributes */
export type GlobalAttributes =
  ${globalUnion}

/** All ARIA-only attributes */
export type AriaAttributes =
  ${ariaUnion}

/** All event-handler-only attributes (onclick, oninput, etc.) */
export type EventAttributes =
  ${eventUnion}

/** Tag-specific attributes only */
export type SpecificAttributesMap = {
${specificEntries}
}

/** All supported HTML tags */
export type HtmlTag = keyof SpecificAttributesMap | ''

/** Base set shared by every tag */
export type BaseAttributes =
  GlobalAttributes |
  AriaAttributes |
  EventAttributes

/** Tag-specific attrs for T */
export type SpecificAttributesForTag<T extends HtmlTag> =
  T extends keyof SpecificAttributesMap ? SpecificAttributesMap[T] : never

/** All allowed attrs for T (base + specific) */
export type AttributesForTag<T extends HtmlTag> =
  BaseAttributes |
  SpecificAttributesForTag<T>

/** A union of absolutely every attribute name */
export type AllAttributes =
  BaseAttributes |
  SpecificAttributesMap[keyof SpecificAttributesMap]
`.trim()

  const formatted = await prettier.format(code, {
    parser: 'typescript',
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    endOfLine: 'lf',
  })

  fs.writeFileSync(outTs, formatted)
  console.log(`✅ Wrote ${outTs}`)
}

main().catch(console.error)
