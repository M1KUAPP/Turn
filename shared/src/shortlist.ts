import MiniSearch from 'minisearch'
import { commonWords } from './common-words'

/** A phrase in the user's bank, as the shortlist sees it. */
export type Phrase = {
  id: string
  text: string
  /** The ids of the places the phrase is tied to. */
  places: readonly string[]
  /** Yes, No, and Not sure. */
  fixed?: boolean
  /** The conversation strip's five. */
  strip?: boolean
}

/** The fixed buttons and the strip's phrases are never ranked (ROW-2, SPEAK-7). */
const rankable = (phrase: Phrase) => !phrase.fixed && !phrase.strip

const processTerm = (term: string) => {
  const word = term.toLowerCase()
  return commonWords.has(word) ? null : word
}

/** MiniSearch's BM25+ over the bank's phrases, with its defaults and without common words. */
export class PhraseIndex {
  private readonly search = new MiniSearch<{ id: string; text: string }>({ fields: ['text'], processTerm })
  /** Each indexed phrase's text, since MiniSearch removes a phrase by the text it indexed. */
  private readonly texts = new Map<string, string>()

  /**
   * Brings the index in line with the bank: adds new phrases, removes edited ones by their old text and adds them
   * again, and removes deleted ones. Removing keeps every match's score above 0, which MiniSearch's `discard` doesn't.
   */
  update(bank: readonly Phrase[]): void {
    const ids = new Set<string>()
    for (const { id, text } of bank.filter(rankable)) {
      ids.add(id)
      const indexed = this.texts.get(id)
      if (indexed === text) continue
      if (indexed !== undefined) this.search.remove({ id, text: indexed })
      this.search.add({ id, text })
      this.texts.set(id, text)
    }
    for (const [id, text] of this.texts) {
      if (ids.has(id)) continue
      this.search.remove({ id, text })
      this.texts.delete(id)
    }
  }

  /** The ids of the phrases that share a word with the line, other than common words, best first. */
  match(line: string): string[] {
    return this.search.search(line).map((result) => result.id)
  }
}
