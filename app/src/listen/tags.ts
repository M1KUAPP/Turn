import { limits, type Candidate, type Category, type LineRequest } from '@turn/shared/relay'
import type { NameKind, NameSpan } from '../../../modules/turn-listen/src'

export type { NameKind, NameSpan } from '../../../modules/turn-listen/src'

export type NameFinder = (texts: readonly string[]) => Promise<readonly (readonly NameSpan[])[]>

export type TagRequestInput = Pick<LineRequest, 'line' | 'place' | 'categories' | 'candidates'> & {
  spares: readonly Candidate[]
}

type TaggedRequest = Pick<LineRequest, 'line' | 'place' | 'categories' | 'candidates'>
type Source = { candidate: Candidate; spans: readonly NameSpan[] }

const normalize = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ')

const codePoints = (text: string) => Array.from(text)

const cut = (text: string, length: number, fromEnd = false) => {
  const points = codePoints(text)
  return (fromEnd ? points.slice(-length) : points.slice(0, length)).join('')
}

const tagName = (kind: NameKind, index: number) =>
  `[${kind === 'person' ? 'PERSON' : kind === 'place' ? 'PLACE' : 'ORG'} ${index}]`

function validSpans(text: string, spans: readonly NameSpan[]) {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end)
  const result: NameSpan[] = []
  let end = 0
  for (const span of sorted) {
    if (
      !Number.isInteger(span.start) ||
      !Number.isInteger(span.end) ||
      span.start < end ||
      span.start < 0 ||
      span.end <= span.start ||
      span.end > text.length
    ) {
      continue
    }
    const splitsPair = (offset: number) => {
      const before = text.charCodeAt(offset - 1)
      const after = text.charCodeAt(offset)
      return before >= 0xd800 && before <= 0xdbff && after >= 0xdc00 && after <= 0xdfff
    }
    if (splitsPair(span.start) || splitsPair(span.end)) continue
    result.push(span)
    end = span.end
  }
  return result
}

function tagText(
  text: string,
  spans: readonly NameSpan[],
  names: Map<NameKind, Map<string, string>>,
  allocate: boolean
) {
  const valid = validSpans(text, spans)
  for (const span of valid) {
    const key = normalize(text.slice(span.start, span.end))
    if (!key) continue
    const byName = names.get(span.kind)!
    if (byName.has(key) || !allocate) continue
    byName.set(key, tagName(span.kind, byName.size + 1))
  }

  let tagged = text
  for (const span of [...valid].reverse()) {
    const key = normalize(text.slice(span.start, span.end))
    const replacement = names.get(span.kind)!.get(key)
    if (replacement) tagged = tagged.slice(0, span.start) + replacement + tagged.slice(span.end)
  }
  return tagged
}

function createNameMaps(): Map<NameKind, Map<string, string>> {
  return new Map([
    ['person', new Map()],
    ['place', new Map()],
    ['org', new Map()]
  ])
}

function utf8Length(text: string) {
  let bytes = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code <= 0x7f) bytes++
    else if (code <= 0x7ff) bytes += 2
    else if (code >= 0xd800 && code <= 0xdbff && text.charCodeAt(i + 1) >= 0xdc00 && text.charCodeAt(i + 1) <= 0xdfff) {
      bytes += 4
      i++
    } else bytes += 3
  }
  return bytes
}

/** Replaces names in the request fields, then applies the relay's character limits. */
export async function tagRequest(input: TagRequestInput, findNames: NameFinder): Promise<TaggedRequest> {
  const candidates = input.candidates.slice(0, limits.candidates)
  const categories = input.categories.slice(0, limits.categories)
  const textInputs = [
    input.line,
    ...candidates.map(({ text }) => text),
    ...input.spares.map(({ text }) => text),
    ...categories.map(({ name }) => name),
    input.place
  ]
  const found = await findNames(textInputs)
  const lineSpans = found[0] ?? []
  const candidateOffset = 1
  const spareOffset = candidateOffset + candidates.length
  const categoryOffset = spareOffset + input.spares.length
  const placeOffset = categoryOffset + categories.length
  let selected: Source[] = candidates.map((candidate, i) => ({ candidate, spans: found[candidateOffset + i] ?? [] }))
  let nextSpare = 0

  while (true) {
    const names = createNameMaps()
    const line = tagText(input.line, lineSpans, names, true)
    const taggedCandidates = selected.map(({ candidate, spans }) => ({
      id: candidate.id,
      text: tagText(candidate.text, spans, names, true)
    }))
    const taggedCategories: Category[] = categories.map((category, i) => ({
      ...category,
      name: tagText(category.name, found[categoryOffset + i] ?? [], names, true)
    }))
    const place = tagText(input.place, found[placeOffset] ?? [], names, true)
    const tooLong = taggedCandidates.findIndex(({ text }) => codePoints(text).length > limits.text)

    if (tooLong === -1) {
      return {
        line: cut(line, limits.line, true),
        place: cut(place, limits.name),
        categories: taggedCategories.map((category) => ({ ...category, name: cut(category.name, limits.name) })),
        candidates: taggedCandidates
      }
    }

    const spare = input.spares[nextSpare]
    if (spare) {
      selected[tooLong] = { candidate: spare, spans: found[spareOffset + nextSpare] ?? [] }
      nextSpare++
    } else {
      selected.splice(tooLong, 1)
    }
  }
}

/** Drops the last candidate until the exact JSON body fits the relay's UTF-8 byte limit. */
export function fitRequest(request: LineRequest): LineRequest {
  let fitted = request
  while (utf8Length(JSON.stringify(fitted)) > limits.bytes && fitted.candidates.length > 0) {
    fitted = { ...fitted, candidates: fitted.candidates.slice(0, -1) }
  }
  return fitted
}
