# Turn's shortlist and row research notes

How MiniSearch, a common-word list, a yes-or-no check, and a timing test fit
the shortlist and the phone's own ranking, read for issues #23 and #25. Every
source was read on September 23, 2026, and judgment starts with "Synthesis:".

Contents:

1.  [MiniSearch 7.2.0](#minisearch-720)
1.  [Hands-on check](#hands-on-check)
1.  [Common-word lists](#common-word-lists)
1.  [Yes-or-no question openers](#yes-or-no-question-openers)
1.  [Curly apostrophes](#curly-apostrophes)
1.  [Timing tests in Vitest 4.1](#timing-tests-in-vitest-41)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## MiniSearch 7.2.0

Line numbers are in `src/MiniSearch.ts` at the `v7.2.0` tag.

- **Still `latest`.** 7.2.0 was published 2025-09-16 12:42 UTC, six minutes
  after 7.1.3, under the MIT license. `exports["."]` maps `import` to
  `./dist/es/index.js` and `require` to `./dist/cjs/index.cjs`, and
  `"types": "./dist/es/index.d.ts"` ships beside the ES build ([npm][npm-ms]).
  `import MiniSearch from 'minisearch'` type-checks under TypeScript 6.0.3
  with `moduleResolution: "bundler"` and `verbatimModuleSyntax` (see
  [Hands-on check](#hands-on-check)).
- **Tokenizer.** `tokenize: (text) => text.split(SPACE_OR_PUNCTUATION)` (line
  2180), with `SPACE_OR_PUNCTUATION = /[\n\r\p{Z}\p{P}]+/u` (line 2261), which
  "matches any Unicode space, newline, or punctuation character"
  ([source][ms-src]). Both ' and ’ are punctuation, so `don't` and `don’t`
  give `don`, `t`; `it's` gives `it`, `s`; `well-known` gives `well`,
  `known`; digits stay (`10am`, `$5`), but `3.5` gives `3`, `5`. A trailing
  period leaves an empty last token.
- **`processTerm`.** The default is `term.toLowerCase()` (line 2181). In `add`
  (line 746), a falsy result is skipped (`else if (processedTerm)`), but array
  items are added without that check. The field's length is
  `new Set(tokens).size`, taken before `processTerm`, so dropped common words
  and the empty token still lengthen a phrase ([source][ms-src]).
- **Search-time terms.** `executeQuery` (line 1694) builds
  `{ tokenize, processTerm, ...globalSearchOptions, ...searchOptions }`, so a
  per-search `processTerm` wins, then the constructor's `searchOptions`, then
  the index-time one; `.filter((term) => !!term)` drops `null`, `undefined`,
  `false`, and `''` ([source][ms-src]).
- **Search defaults.** `defaultSearchOptions` (line 2191) has
  `combineWith: OR`, `prefix: false`, `fuzzy: false`, `maxFuzzy: 6`,
  `boost: {}`, and `bm25: { k: 1.2, b: 0.7, d: 0.5 }` (line 2148);
  `boostDocument` is unset. `filter?: (result: SearchResult) => boolean`
  exists and runs after scoring ([source][ms-src]).
- **Results.** `search` (line 1360) returns
  `{ id, score, terms, queryTerms, match }` plus stored fields, with
  `score: score * quality`, where quality is the number of matched query
  terms. It sorts with `byScore`, `b - a`. The sort is stable, so ties keep
  the map's order: phrases holding the first query term, in the order they
  were added, then newcomers from later terms, as the `OR` combinator at
  line 2067 does ([source][ms-src]).
- **Scores can go negative after `discard`.** `calcBM25Score` (line 2150)
  uses `Math.log(1 + (N - n + 0.5) / (n + 0.5))`, which is
  `log((N + 1) / (n + 0.5))`: above 0 only while `n ≤ N`, and `d` keeps the
  rest ≥ 0.5. `discard` lowers `N` at once, but `termResults` (line 1873)
  starts `n` at the posting list's size and only subtracts stale entries as
  it meets them, so phrases met first can see `n > N` ([source][ms-src]).
- **All terms dropped.** No query specs reach `combineResults`, which returns
  `new Map()` for an empty list (line 1808), so `search` returns `[]`.
- **Updates.** `add` throws on a duplicate ID. `remove` needs the full
  document: "The document to remove must NOT have changed between indexing
  and removal, otherwise the index will be corrupted." `discard(id)` needs
  only the ID and leaves cleanup for later; `replace` is `discard` then `add`
  (line 1024); `has(id)` reads `_idToShortId` (line 1181). `vacuum()` is async,
  in batches of 1,000 with 10 ms waits; `autoVacuum` defaults to true, with
  `minDirtCount: 20` and `minDirtFactor: 0.1` (lines 2207-2210)
  ([source][ms-src]).
- Synthesis: keep each phrase's indexed text and, on an edit or delete, call
  `remove(old)` then `add(new)`. That keeps counts exact and every score
  above 0, so "shares a word" can stay "appears in the results". Avoid
  `discard` and `replace`, or treat any returned phrase as a match whatever
  its score.

[npm-ms]: https://registry.npmjs.org/minisearch
[ms-src]: https://github.com/lucaong/minisearch/blob/v7.2.0/src/MiniSearch.ts

## Hands-on check

Bun 1.4.2 on macOS `arm64`, with `minisearch` 7.2.0, `typescript` 6.0.3, and
`vitest` 4.1.11 in a scratch folder. Ten phrases were indexed with a
`processTerm` that lowercases and drops a small list, including `t`, `s`,
`m`, and `don`.

```text
"Do you want some water?" => [2, 7.2588, [want, water]], [6, 2.0472, [want]],
                             [0, 1.9613, [water]], [5, 1.9613, [water]]
"Is the new nurse here?"  => [3, 9.6003, [new, nurse]], [7, 2.0472, [nurse]]
"Can you hear me?"        => []    "I don’t know" => []    "the a is" => []
replace(5, "Cold water"); "cold water" => [5, 10.7477], [0, 1.5309], [2, 1.235]
discard(0); has(0) => false; "water" => [5, 2.3951], [2, 1.9431]
3 x "water", discard(c): a -0.2312, b -0.2312; remove(c): a 0.2735, b 0.2735
"water" 0.2244, "water." 0.1908, "the water" 0.1908
```

- **Ties** kept insertion order (0 before 5), and a phrase matching two query
  terms scored far higher, as `quality` doubles its sum.
- **Types.** `import MiniSearch from 'minisearch'` and
  `import type { SearchResult }` passed `tsc` with the repo's base options;
  `performance.now()` failed with TS2304, even in a test file that imports
  `vitest`.
- **Timing.** 2,000 synthetic phrases of 3 to 8 words, over 1,500 words
  skewed toward common ones: `addAll` took 5.89 ms. Over 50 lines of 4 to 11
  words, `search` plus a sort had a median of 0.084 ms and a maximum of
  1.729 ms, the first query including warm-up.

## Common-word lists

| List                              | Words | License                           |
| --------------------------------- | ----- | --------------------------------- |
| Lucene `ENGLISH_STOP_WORDS_SET`   | 33    | Apache-2.0 ([Lucene][lucene])     |
| Snowball English `stop.txt`       | 174   | BSD-3-Clause ([Snowball][sb-lic]) |
| NLTK `stopwords/english`          | 198   | not stated in the corpus README   |
| scikit-learn `ENGLISH_STOP_WORDS` | 318   | BSD-3-Clause ([scikit-learn][sk]) |

Counted from the primary files; Y means the word is in the list.

| Word or fragment                   | Lucene | Snowball | NLTK | scikit-learn |
| ---------------------------------- | ------ | -------- | ---- | ------------ |
| no, not                            | Y      | Y        | Y    | Y            |
| don't                              |        | Y        | Y    |              |
| i, you, me, what, how, where, have |        | Y        | Y    | Y            |
| do, can                            |        | do only  | Y    | Y            |
| want, help                         |        |          |      |              |
| please                             |        |          |      | Y            |
| t, s, don, ll, ve, m, d            |        |          | Y    |              |
| re                                 |        |          | Y    | Y            |

- **Lucene** keeps pronouns and question words, so "I" and "what" would link
  most phrases ([Lucene][lucene]).
- **Snowball** lists contractions whole, such as `i'm` and `don't`, which
  MiniSearch's tokenizer never produces ([Snowball][snowball]).
- **NLTK** adds the fragments `don`, `t`, `ll`, `ve`, and `m`
  ([NLTK][nltk]); **scikit-learn** takes its list from the "Glasgow
  Information Retrieval Group" and includes "please" ([scikit-learn][sk]).
- Synthesis: start from NLTK's list, since it already holds both whole
  contractions and the fragments the tokenizer makes, and add "please". Keep
  "help" and "want" as content words unless the evaluation shows noise. Every
  list drops "no" and "not", which is right here: negation shouldn't link
  phrases, and the fixed buttons answer yes or no.

[lucene]: https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/java/org/apache/lucene/analysis/en/EnglishAnalyzer.java
[sk]: https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/feature_extraction/_stop_words.py
[snowball]: https://snowballstem.org/algorithms/english/stop.txt
[sb-lic]: https://snowballstem.org/license.html
[nltk]: https://github.com/nltk/nltk_data/blob/gh-pages/packages/corpora/stopwords.zip

## Yes-or-no question openers

- **The verb goes first.** "We make Yes/No questions by putting the first
  part of the verb in front of the subject", as in "Are they working hard?",
  "Had they worked hard?", and "Might they have been working hard?"
  ([British Council][bc-questions]).
- **Do, does, and did.** "For all verbs except be and have, we use do/does
  or did to make Yes/No questions in the present simple and past simple";
  with be, the verb itself leads: "Am I?", "Is he?", "Are you?", "Was it?",
  "Were they?" ([British Council][bc-questions]).
- **The modals.** "The modal verbs are: can may must shall will could might
  should would" ([British Council][bc-modals]); the page names no other, and
  its team calls "have to" only "sometimes called a semi-modal verb".
- Synthesis: match the first word, lowercased with ’ read as ', against
  `do`, `does`, `did`, `am`, `is`, `are`, `was`, `were`, `have`, `has`,
  `had`, the nine modals, and their `n't` forms, plus `can't`, `won't`,
  `shan't`, and `cannot`. That passes "Do you want some water?", "Can you
  hear me?", and "Is the new nurse here?", and rejects "It's cold out today."
  "Need", "dare", and "ought" aren't on the list and are rare as openers.
- Synthesis: the rule misses statements said as questions ("You're tired?")
  and wrongly flags either-or questions ("Do you want tea or coffee?") and
  imperatives ("Have a seat."). Checking the first token from MiniSearch's
  tokenizer won't do, since `Don’t` becomes `don`, `t`.

[bc-questions]: https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/questions-and-negatives
[bc-modals]: https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/modal-verbs

## Curly apostrophes

- **Typed text.** `smartQuotesType` decides "whether UIKit replaces straight
  apostrophes and quotation marks with region-specific glyphs", and its
  default "selectively enables smart quotes based on the keyboard type"
  ([Apple][apple-smart]).
- **Speech transcripts.** Not found; see [Gaps](#gaps).
- Synthesis: MiniSearch's default tokenizer splits on ' and ’ alike, so the
  index needs no change; only the yes-or-no check must accept both.

[apple-smart]: https://developer.apple.com/documentation/uikit/uitextinputtraits/smartquotestype

## Timing tests in Vitest 4.1

- **`bench` is experimental.** The guide's heading reads "Benchmarking
  Experimental": "You can run benchmark tests with `bench` function via
  Tinybench to compare performance results." ([Vitest guide][vt-guide])
- **`vitest run` skips bench files.** Vitest 4.1.11's defaults are
  `include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"]` for tests and
  `["**/*.{bench,benchmark}.?(c|m)[jt]s?(x)"]` for benchmarks, and `bench()`
  in a test run throws "`bench()` is only available in benchmark mode."
  ([Vitest package][vt-npm])
- **No threshold.** The benchmark options offer `outputJson`, "which can be
  used for `--compare` option later", and nothing that fails a run
  ([Vitest config][vt-config]).
- **`performance` isn't typed.** Of TypeScript 6.0.3's own libs, only
  `lib.dom.d.ts` and `lib.webworker.d.ts` declare it, by a grep of the
  installed package, so `lib: ["es2024"]` with `types: []` fails (see
  [Hands-on check](#hands-on-check)).
- Synthesis: put an ordinary `shared/test/shortlist-speed.test.ts` in the
  normal suite. Build a 2,000-phrase bank once, warm up, run 50 shortlists,
  and `expect(max).toBeLessThan(50)`. Time with `Date.now()`, which ES2024
  types, or add `declare const performance: { now(): number }` to the test
  file. The Mac's 1.7 ms maximum leaves room for slower CI machines.

[vt-guide]: https://v4.vitest.dev/guide/features#benchmarking
[vt-npm]: https://registry.npmjs.org/vitest
[vt-config]: https://v4.vitest.dev/config/benchmark

## Gaps

- **Grammar reference.** The British Council's pages back the openers, but
  not the notes on declarative and either-or questions; Cambridge's
  "Questions: yes-no questions" page returned 403.
- **Licenses.** The NLTK stopwords corpus states no license.
- **Speech framework.** Whether Apple's transcripts write ’ in contractions
  wasn't checked; test on a device.
- **Phone timing.** Every number here is from a Mac, not Hermes on an iPhone.

## See also

- [iPhone build notes on a phrase ranker](/docs/research/0023-turn-ios.md#a-phrase-ranker-in-typescript)
- [TRD, the shortlist](/docs/TRD.md#the-shortlist)
- [TRD, the phone's own ranking](/docs/TRD.md#the-phones-own-ranking)
