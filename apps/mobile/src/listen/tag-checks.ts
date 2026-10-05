import { rebuildGazetteer, type GazetteerFinder } from './gazetteer'
import { tagRequest } from './tags'

export type TagCheckResult = { name: string; passed: boolean; taggedText: string }

/** Runs the on-device name-tagging examples used to check the finder on a device. */
export async function runTagChecks(finder: GazetteerFinder): Promise<TagCheckResult[]> {
  await rebuildGazetteer({ phrases: [{ text: 'Anna is my sister' }], places: [] }, finder)

  const named = await tagRequest(
    {
      line: 'Did Anna call?',
      place: 'Home',
      categories: [],
      candidates: [{ id: 'anna', text: 'Anna is my sister' }],
      spares: []
    },
    finder.findNames
  )
  const namedText = `line: ${named.line}; candidate: ${named.candidates[0]?.text ?? ''}`

  const lowercase = await tagRequest(
    {
      line: 'did anna call?',
      place: 'Home',
      categories: [],
      candidates: [{ id: 'anna', text: 'Anna is my sister' }],
      spares: []
    },
    finder.findNames
  )

  const long = await tagRequest(
    { line: 'A'.repeat(400), place: 'Home', categories: [], candidates: [], spares: [] },
    finder.findNames
  )

  // A proper name: Clinic or Home has no name for the tagger to find (TRD).
  const place = await tagRequest(
    { line: 'I am here', place: 'Cupertino', categories: [], candidates: [], spares: [] },
    finder.findNames
  )

  return [
    {
      name: 'LISTEN-5',
      passed:
        named.line.includes('[PERSON 1]') &&
        named.candidates[0]?.text.includes('[PERSON 1]') === true &&
        !namedText.includes('Anna'),
      taggedText: namedText
    },
    {
      name: 'LISTEN-5 lowercase gazetteer',
      passed: lowercase.line.includes('[PERSON 1]') && !lowercase.line.includes('anna'),
      taggedText: lowercase.line
    },
    {
      name: 'LISTEN-6',
      passed: long.line === 'A'.repeat(300),
      taggedText: long.line
    },
    {
      name: 'PLACE-3',
      passed: place.place === '[PLACE 1]' && !place.place.includes('Cupertino'),
      taggedText: `place: ${place.place}`
    }
  ]
}
