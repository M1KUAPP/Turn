import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { sentenceEmbedding, type SentenceEmbedding } from './apple'
import {
  againstBand,
  beyondReach,
  brier,
  reliability,
  reliabilityPlot,
  topPhrase,
  type Brier,
  type Reliability
} from './calibration'
import { plot, riskCoverage, type Curve, type Point } from './curves'
import { amongTheEighty, linesFrom, phrases, root, type Line } from './data'
import { atCutOff, embeddingModel, embeddings, qwen, qwenInstruction, qwenModel, workersAi } from './embeddings'
import { jev, relayModel, type JevCall } from './jev'
import { capital, cell, listOf, table, wrap } from './prose'
import { keyword, place } from './rankers'
import { reranker, rerankerModel } from './reranker'
import {
  bigButtons,
  kindMatrix,
  kinds,
  outcomes,
  scoreLines,
  sharesNoWord,
  summarize,
  topSixGap,
  type Count,
  type LineScore,
  type Scores
} from './score'
import { percentile, wilson } from './stats'

/** A share as the TRD writes one: in whole percents at or above 10%, and to one decimal below. */
const percent = (share: number) => {
  const points = share * 100
  return `${points >= 10 ? Math.round(points) : Math.round(points * 10) / 10}%`
}

/** A rate with its 95% Wilson interval, such as "56 of 80, 70% (59% to 79%)", or "0 of 0" over no lines. */
export const rate = ({ k, n }: Count): string => {
  const interval = wilson(k, n)
  if (interval === null) return '0 of 0'
  return `${k} of ${n}, ${percent(k / n)} (${percent(interval.low)} to ${percent(interval.high)})`
}

/** Who wrote and labeled the lines, counted from the file, then who made the 80 lines and the bank, as the TRD says. */
const provenance = (labeled: readonly Line[]) => {
  const authors = Map.groupBy(labeled, (line) => line.author)
  const writers = listOf([...authors].map(([author, written]) => `${author} wrote ${written.length}`))
  const labelers = listOf([...new Set(labeled.map((line) => line.labeler))])
  return [
    '## Who wrote the data',
    [
      wrap(`- **These lines:** ${writers}, and ${labelers} labeled their acceptable replies.`, '  '),
      wrap(
        "- **The 80 lines, their labels, and the bank,** as the TRD's evaluation data records: at the team's " +
          'direction, Claude subagents wrote the 80 lines and the starter bank on September 23, 2026. Two wrote 40 ' +
          'lines each from a brief that showed no phrase of the bank, as claude-a and claude-b; a third wrote the ' +
          'bank without seeing the lines, and a fourth read every phrase. Two more, claude-c and claude-d, then ' +
          "labeled every line's replies, each alone and from a brief that set no quota. Their labels left too few " +
          'lines with no reply, so claude-f wrote 20 more lines meant to have none from a brief that showed no ' +
          'list of the bank\'s phrases, only the labeling rules, which name the fixed buttons and "I don\'t know"; ' +
          'of the 80 lines, it saw only the five that its first draft repeated, quoted back as situations to ' +
          'avoid. claude-g and claude-h labeled the new lines among the 80 by the same rules; 12 of them replaced ' +
          "lines with a reply, so that 16 lines have none. claude-c's labeling, with claude-g's for the new lines, " +
          'is the one the evaluation scores. Text a language model wrote or labeled may suit a ranker built on ' +
          'one, and two labelings by one model show consistency rather than correctness. On that date, no ' +
          'teammate had yet read the bank or labeled a line, and no clinic had reviewed the bank.',
        '  '
      )
    ].join('\n')
  ]
}

/** A share in points, to one decimal. */
const points = (share: number) => (share * 100).toFixed(1)

/**
 * How the report names Jev: by name, or, while naming is off, as the hosted decision model, with its pin's version but
 * not its name, so the README can copy the table (CONSENT-7).
 */
type Naming = { jev: string; ranker: (name: string) => string; model: (model: string) => string }

const named: Naming = { jev: 'Jev', ranker: (name) => name, model: (model) => `\`${model}\`` }

const unnamed: Naming = {
  jev: 'the hosted decision model',
  ranker: (name) => (name === 'jev' ? 'hosted decision model' : name),
  // Only the version's numbers, since whatever else a model's name holds may name it.
  model: (model) => {
    const version = /\d+(?:\.\d+)*/.exec(model)?.[0]
    return version === undefined ? 'a version it gives no number for' : `version ${version}`
  }
}

/**
 * Jev's top 6 minus embeddings', with its paired interval, or nothing unless both ranked. Only all lines give EVAL-4's
 * verdict: it names one comparison, and more intervals would make a false "trails" likelier.
 */
const gapLine = (scores: readonly LineScore<Line>[], names: readonly string[], naming: Naming, verdict: boolean) => {
  const gap = names.includes('jev') && names.includes('embeddings') ? topSixGap(scores, 'jev', 'embeddings') : null
  if (gap === null) return []
  const { difference, low, high } = gap
  // What EVAL-4 reads from the interval.
  const says = {
    trails: `${naming.jev} trails embeddings (EVAL-4)`,
    leads: `${naming.jev} leads embeddings`,
    'no clear difference': "there's no clear difference"
  }
  return [
    wrap(
      `${capital(naming.jev)} minus embeddings in top 6: ${difference > 0 ? '+' : ''}${points(difference)} points, ` +
        `with a 95% paired interval of ${points(low)} to ${points(high)}` +
        `${verdict ? `, so ${says[gap.verdict]}` : ''}.`
    )
  ]
}

/** One group's ranking and row, with each rate's interval, and EVAL-4's verdict if it's the group of all lines. */
const groupSections = (
  { name, about, verdict }: { name: string; about: string; verdict: boolean },
  scores: readonly LineScore<Line>[],
  names: readonly string[],
  naming: Naming
) => {
  const lower = name[0].toLowerCase() + name.slice(1)
  if (scores.length === 0) return [`## ${name}`, wrap(`There are no lines ${about}.`)]
  const summary = summarize(scores)
  const ranking =
    summary.recall.n === 0
      ? ['None of them has an acceptable phrase besides Yes, No, and Not sure.']
      : [
          wrap(`On the ${summary.recall.n} with an acceptable phrase besides Yes, No, and Not sure:`),
          table(
            ['Ranker', 'Top 1', 'Top 6', 'Mean reciprocal rank'],
            [
              [
                'chance',
                percent(summary.chance.top1),
                percent(summary.chance.top6),
                summary.chance.meanReciprocalRank.toFixed(2)
              ],
              ...names.map((ranker) => {
                const { top1, top6, meanReciprocalRank } = summary.rankers[ranker]
                return [naming.ranker(ranker), rate(top1), rate(top6), meanReciprocalRank.toFixed(2)]
              })
            ]
          ),
          wrap(`The shortlist's recall at 40: ${rate(summary.recall)}.`),
          ...gapLine(scores, names, naming, verdict)
        ]
  const capitalized = outcomes.map((outcome) => outcome[0].toUpperCase() + outcome.slice(1))
  const row = table(
    ['Ranker', ...capitalized, 'Coverage', 'Risk'],
    [
      [
        'always hold',
        ...outcomes.map((outcome) => String(summary.alwaysHold[outcome])),
        rate({ k: 0, n: summary.lines }),
        rate({ k: 0, n: 0 })
      ],
      ...names.map((ranker) => {
        const { outcomes: seen, coverage, risk } = summary.rankers[ranker]
        const counts = outcomes.map((outcome) => String(seen[outcome]))
        return [naming.ranker(ranker), ...counts, rate(coverage), rate(risk)]
      })
    ]
  )
  return [
    `## ${name}`,
    wrap(`On the ${summary.lines} lines ${about}.`),
    `### Ranking on ${lower}`,
    ...ranking,
    `### The row on ${lower}`,
    row
  ]
}

/** What the report names of Apple's sentence embedding, as its helper named it. */
type Apple = Pick<SentenceEmbedding, 'revision' | 'dimension' | 'system'>

/**
 * Jev's pin, where it's set, and what Jev reported answering as, then Workers AI's models and Apple's sentence
 * embedding, with its revision, dimension, and system (EVAL-6).
 */
const models = (pin: string, calls: readonly JevCall[], naming: Naming, apple: Apple) => {
  const byModel = [...Map.groupBy(calls, (call) => call.model)]
  const answered = listOf(
    byModel.map(
      ([model, made]) =>
        `${naming.model(model)} on ${made.length === calls.length ? 'all ' : ''}${made.length} ` +
        (made.length === 1 ? 'call' : 'calls')
    )
  )
  return (
    `- **Models:** ${capital(naming.jev)}, pinned to ${naming.model(pin)} by \`worker/wrangler.jsonc\`, ` +
    `which answered as ${answered}; Workers AI's \`${embeddingModel}\`, with \`cls\` pooling, ` +
    `\`${rerankerModel}\`, and \`${qwenModel}\`, with the instruction "${qwenInstruction}"; and Apple's ` +
    `English sentence embedding at revision ${apple.revision}, of ${apple.dimension} numbers, on macOS ` +
    `${apple.system}.`
  )
}

/** Whether EVAL-5 names a line: its writer marked it yes-or-no, or its concerns name pain or consent. */
const sensitive = (line: Line) =>
  line.kind === 'yes_no' || line.concerns.includes('pain') || line.concerns.includes('consent')

/** Every big button any ranker showed on a line EVAL-5 names, with its phrase and whether it's right. */
const bigButtonSection = (scores: readonly LineScore<Line>[], naming: Naming) => {
  const shown = bigButtons(scores.filter(({ line }) => sensitive(line)))
  const text = (id: string) => phrases.find((phrase) => phrase.id === id)?.text ?? id
  const which = 'a line its writer marked yes-or-no, or on one about pain or consent, in any of its answers'
  if (shown.length === 0) {
    return ['## Big buttons on yes-or-no, pain, and consent lines', wrap(`No ranker showed a big button on ${which}.`)]
  }
  const wrong = shown.filter(({ right }) => !right).length
  return [
    '## Big buttons on yes-or-no, pain, and consent lines',
    wrap(`Every big button a ranker showed on ${which} (EVAL-5): ${shown.length}, ${wrong} of them wrong.`),
    table(
      ['Ranker', 'Line', 'The partner said', 'Big button', 'Right or wrong', 'Answers'],
      shown.map(({ ranker, line, phrase, right, answers }) => [
        naming.ranker(ranker),
        line.id,
        cell(line.text),
        cell(text(phrase)),
        right ? 'right' : 'wrong',
        `${answers.k} of ${answers.n}`
      ])
    )
  ]
}

/** Each kind of question as the report names it. */
const kindNames = { yes_no: 'Yes or no', either_or: 'Either or', open: 'Open', not_a_question: 'Not a question' }

/**
 * Jev's most likely kind of question against its writer's, on every line: the accuracy with its interval, and the
 * confusion matrix, since a yes-or-no call brings up the fixed buttons.
 */
const kindSection = (scores: readonly LineScore<Line>[], naming: Naming) => {
  const { counts, right } = kindMatrix(scores, 'jev')
  return [
    '## The question kind',
    wrap(
      `${capital(naming.jev)}'s most likely kind of question against its writer's, on all ${scores.length} lines: ` +
        `right on ${rate(right)}. Each row is the writer's kind, and each column ${naming.jev}'s, or a tie when ` +
        'two kinds share the top.'
    ),
    table(
      ["Writer's kind", ...kinds.map((kind) => kindNames[kind]), 'Tie'],
      kinds.map((kind) => [
        kindNames[kind],
        ...[...kinds, 'tie' as const].map((called) => String(counts[kind][called]))
      ])
    )
  ]
}

/**
 * Each ranker's risk-coverage curve: the plot, and as its text, each ranker's risk at the first point that covers at
 * least each share of the lines.
 */
const curveSection = (count: number, curves: readonly Curve[], image: string) => {
  const shares = [0.2, 0.4, 0.6, 0.8, 1]
  // A little slack, since 4 of 5 lines is a hair under 0.8 in floating point.
  const at = (points: readonly Point[], share: number) => points.find(({ coverage }) => coverage >= share - 1e-9)
  return [
    '## Risk and coverage',
    `![Risk against coverage for each ranker](${image})`,
    wrap(
      `Each ranker's risk against its coverage on all ${count} lines, as its threshold falls through its top ` +
        'scores: a line is covered when its top phrase reaches the threshold, and right when one of its first six ' +
        "phrases at or above it is acceptable; the fixed buttons and the big button don't count. place and keyword " +
        'score each phrase 1 or 0, so each makes one point. The table gives the risk at the first point that covers ' +
        'at least each share of the lines, and at what coverage.'
    ),
    table(
      ['Ranker', ...shares.map((share) => percent(share))],
      curves.map(([name, points]) => [
        name,
        ...shares.map((share) => {
          const point = at(points, share)
          return point ? `${percent(point.risk)} at ${percent(point.coverage)}` : 'never'
        })
      ])
    )
  ]
}

/**
 * Each fold's cut-off for each ranker whose scores aren't probabilities, which holds a line when no phrase's score
 * reaches it, to three significant figures, since the reranker's scores are small.
 */
const cutOffSection = (cutOffs: Readonly<Record<string, readonly number[]>>, fold: readonly number[]) => {
  const counts = [0, 1, 2, 3, 4].map((held) => fold.filter((f) => f === held).length)
  const value = (cutOff: number, held: number) =>
    counts[held] === 0 ? 'no lines' : cutOff === Infinity ? 'hold all' : cutOff.toPrecision(3)
  return [
    '## The cut-offs for holding',
    wrap(
      'The lines went into five folds, from one seeded shuffle, each with its share of the lines with no acceptable ' +
        `reply: folds 1 to 5 held ${listOf(counts.map(String))} lines. For each ranker below, each fold's lines ` +
        "were scored at the cut-off, of the six highest scores of each of the other four folds' lines, that made the " +
        'most of those lines right, a tie going to the higher; "hold all" is one above every score. A line whose top ' +
        "phrase falls short of its cut-off shows no phrase: the row holds, unless the phone's yes-or-no rule brings " +
        'the fixed buttons.'
    ),
    table(
      ['Ranker', ...counts.map((_, held) => `Fold ${held + 1}`)],
      Object.entries(cutOffs).map(([name, values]) => [name, ...values.map(value)])
    )
  ]
}

/** Three decimals, without the zeros that end them. */
const decimals = (value: number) => String(Number(value.toFixed(3)))

/**
 * What the calibration section reports: the diagram's makings and its image, the Brier score, and how many lines have
 * no acceptable phrase among their 40.
 */
type Calibration = { reliability: Reliability; brier: Brier; image: string; beyondReach: number }

/** The reliability diagram's text: a row for each block of the fit, with the number of its scores outside the band. */
export const calibrationTable = (fit: Reliability): string =>
  table(
    ['Scores', 'Lines', 'Acceptable', 'Fitted share', 'Outside the band'],
    againstBand(fit).map(({ low, high, lines, right, value, scores, outside }) => [
      low === high ? decimals(low) : `${decimals(low)} to ${decimals(high)}`,
      String(lines),
      String(right),
      value.toFixed(2),
      `${outside} of ${scores} ${scores === 1 ? 'score' : 'scores'}`
    ])
  )

/**
 * Jev's top phrase against whether it's acceptable, on every line (EVAL-8): the reliability diagram beside the report,
 * a table of its fit's blocks with how many of each block's scores the fit leaves the band at as its text, and the
 * Brier score with its interval and CORP's decomposition.
 */
const calibrationSection = ({ reliability: fit, brier: score, image, beyondReach }: Calibration, naming: Naming) => {
  const { forecasts } = fit
  const right = forecasts.filter((forecast) => forecast.right).length
  const three = (value: number) => value.toFixed(3)
  return [
    `## ${capital(naming.jev)}'s calibration`,
    `![Reliability of ${naming.jev}'s top phrase](${image})`,
    wrap(
      `Each line's top phrase in ${naming.jev}'s first timed ranking, ties broken as the row breaks them, against ` +
        `whether it's acceptable, on all ${forecasts.length} lines: ${right} of them are. Of the ` +
        `${forecasts.length}, ${beyondReach} have no acceptable phrase among their 40, so their top phrase is wrong ` +
        'whatever its score. The line is the ' +
        "pool-adjacent-violators fit, as CORP's reliability diagram draws it: the share acceptable at each score, " +
        "never falling as the score rises, with scores the lines can't tell apart pooled into a block. A calibrated " +
        "ranker's fit would follow the diagonal. At each score, the band holds 90% of the fits from 9,999 resamples " +
        "of the lines, each outcome drawn as its score says, as a calibrated ranker's would be. It holds them at " +
        "each score apart, so even a calibrated ranker's fit would lie outside it at about one score in ten. The " +
        'table gives each block, with the number of its scores where the fit lies outside the band.'
    ),
    calibrationTable(fit),
    wrap(
      `The Brier score, the mean of the squared gap between the top score and 1 for an acceptable phrase or 0 for ` +
        `one that isn't, is ${three(score.score)}, with a 95% bootstrap interval of ${three(score.low)} to ` +
        `${three(score.high)}; lower is better. Always forecasting the share acceptable, ${right} of ` +
        `${forecasts.length}, would score ${three(score.uncertainty)}` +
        (Number.isNaN(score.skill)
          ? ', which leaves no skill score, since every line is right or none is. '
          : `, so the skill score, 1 minus the Brier score over that, is ${three(score.skill)}: above 0 beats ` +
            'that constant forecast, and below 0 does worse. ') +
        `CORP's decomposition gives a miscalibration ` +
        `of ${three(score.miscalibration)} and a discrimination of ${three(score.discrimination)}: before rounding, ` +
        'the Brier score is the miscalibration, minus the discrimination, plus that score of always forecasting ' +
        'the share.'
    )
  ]
}

/** An anchor as GitHub makes one from a heading. */
const slug = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9 _-]/g, '')
    .replaceAll(' ', '-')

/** The report for the lines, in Markdown, from their scores with the app's own shortlist, rankers, and row rules. */
const render = (
  labeled: readonly Line[],
  { lines: scores, timings, fold, cutOffs }: Scores<Line>,
  details: {
    run: string
    file: string
    pin: string
    calls: readonly JevCall[]
    curves: readonly Curve[]
    image: string
    naming: Naming
    apple: Apple
    calibration: Calibration
  }
) => {
  const { run, file, pin, calls, curves, image, naming, apple, calibration } = details
  const names = Object.keys(timings.rankers)
  const groups = [
    { name: 'All lines', about: 'in the file', keep: () => true, verdict: true },
    {
      name: 'Yes-or-no lines',
      about: 'that their writer marked yes-or-no',
      keep: (line: Line) => line.kind === 'yes_no',
      verdict: false
    },
    {
      name: 'Pain and consent lines',
      about: 'about pain or asking for consent, which EVAL-5 names',
      keep: (line: Line) => line.concerns.includes('pain') || line.concerns.includes('consent'),
      verdict: false
    },
    {
      name: 'Lines that share no word with a reply',
      about: 'that share no word with an acceptable reply, as the phone matches words',
      keep: (line: Line) => sharesNoWord(line, phrases),
      verdict: false
    }
  ]
  const steps: [string, number[]][] = [['shortlist', timings.shortlist], ...Object.entries(timings.rankers)]
  const latency = table(
    ['Step', 'Median', '95th percentile', 'Maximum'],
    steps.map(([step, samples]) => [
      naming.ranker(step),
      ...[50, 95, 100].map((q) => percentile(samples, q).toFixed(3))
    ])
  )
  // Each section starts with its heading, which the contents list.
  const sections = [
    provenance(labeled),
    ...groups.map((group) =>
      groupSections(
        group,
        scores.filter(({ line }) => group.keep(line)),
        names,
        naming
      )
    ),
    bigButtonSection(scores, naming),
    ...(names.includes('jev') ? [kindSection(scores, naming)] : []),
    calibrationSection(calibration, naming),
    curveSection(scores.length, curves, image),
    ...(Object.keys(cutOffs).length > 0 ? [cutOffSection(cutOffs, fold)] : []),
    [
      '## Latency',
      wrap(
        'Milliseconds per line over three passes, after a warm-up pass: the app picking the shortlist, then each ' +
          "ranker's ranking, its network trip included. The apple ranker's time is this Mac's, through a pipe to its " +
          "Swift helper, not the phone's."
      ),
      latency
    ]
  ]
  const headings = sections.map(([heading]) => heading.replace(/^## /, ''))
  return (
    [
      "# Turn's evaluation",
      [
        `- **Run:** ${run}.`,
        wrap(`- **Lines:** the ${labeled.length} in \`${file}\`.`, '  '),
        "- **Bank:** the app's own, `app/src/content/starter-bank.json`.",
        wrap(models(pin, calls, naming, apple), '  ')
      ].join('\n'),
      wrap(
        'Each line is scored alone, from an empty row. The app picks its shortlist of 40: up to 24 phrases that ' +
          "share a word with the line, then, since a fresh bank has no taps, the place's first eight phrases in the " +
          "bank's order, then the rest in the bank's order. Each ranker orders those 40, and the row's rules turn " +
          "its ranking into what the user would see. The place's first eight phrases are always among the 40, so " +
          "the place ranker's top 1 and top 6 never depend on the line, though which of its later phrases are " +
          'among them can.'
      ),
      [
        "- **Rankers:** place gives the place's phrases in the bank's order; keyword, the phone's own ranking by " +
          'shared words; embeddings, the cosine between the line and each phrase; ' +
          `${naming.ranker('jev')}, the relay's request as ${naming.jev} answers it, which the row's rules take with ` +
          'their starting policy: a floor of 0.6, a big button above 0.85, and a margin of 0.15; reranker, the ' +
          "cross-encoder's score for the line and each phrase; qwen3, the cosine between the line, embedded as a " +
          'query under its instruction, and each phrase; and apple, the cosine between the line and each phrase in ' +
          "Apple's sentence embedding, computed on a Mac as the phone would. Like embeddings, the last three take " +
          "the phone's yes-or-no rule and bring no big button, and each of the four shows no phrase below its own " +
          'cut-off, which five-fold cross-validation sets.',
        '- **Ranking:** top 1 and top 6 count the lines with an acceptable phrase first or among the first six. ' +
          'A ranker ranks only the phrases it scores above 0, so keyword ranks none on a line that shares no word. ' +
          'Chance is a random order of the same phrases. The mean reciprocal rank is a mean of ranks, not a rate, ' +
          'so it has no interval.',
        '- **The row:** coverage is the share of lines where the row changes, and risk the share of those rows ' +
          'that are wrong. Always holding is right on every line with no acceptable reply.',
        `- **Intervals:** every rate in the ranking's and the row's tables carries its 95% Wilson interval. ` +
          `${capital(naming.jev)} minus embeddings in ` +
          'top 6 carries a 95% paired bootstrap interval, from 9,999 resamples of the same lines drawn from a ' +
          `committed seed, and ${naming.jev} trails only when the whole interval on all lines lies below zero; ` +
          "the subsets' intervals carry no verdict, since more intervals would make a false one likelier.",
        `- **${capital(naming.jev)}'s answers** vary a little from call to call, so each line is scored from the ` +
          'first of the three timed passes, and the big buttons come from all four answers, the warm-up included.'
      ]
        .map((item) => wrap(item, '  '))
        .join('\n'),
      'Contents:',
      headings.map((heading) => `1.  [${heading}](#${slug(heading)})`).join('\n'),
      ...sections.flat()
    ].join('\n\n') + '\n'
  )
}

/** The commit the run is on, and whether the working tree has changes the commit lacks. */
const commit = () => {
  const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
  const hash = git('rev-parse', '--short', 'HEAD')
  try {
    git('diff', '--quiet', 'HEAD')
    return { hash, clean: true }
  } catch {
    return { hash, clean: false }
  }
}

/**
 * `bun run eval`: scores the seven rankers on the labeled lines in `eval/lines.jsonl`, or the file `--lines` names, and
 * writes the report to `eval/results.md`, or the file `--out` names (EVAL-3, EVAL-8), with its two plots beside it. The
 * embeddings, reranker, and qwen3 rankers need `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`, and Jev
 * `TYPESAFE_API_KEY`, in the environment, and apple needs a Mac with Swift. `--unnamed` names Jev as the hosted
 * decision model, for the README while naming is off. It scores any of the 80 lines, whatever file holds them, only
 * from a clean working tree, so the history shows Jev's settings committed before any result (EVAL-2).
 */
export async function main(args: readonly string[]): Promise<void> {
  const { values } = parseArgs({
    args: [...args],
    options: { lines: { type: 'string' }, out: { type: 'string' }, unnamed: { type: 'boolean' } }
  })
  const naming = values.unnamed ? unnamed : named
  const { lines: labeled, file } = linesFrom(values.lines)
  const { hash, clean } = commit()
  if (amongTheEighty(labeled) && !clean) {
    throw new Error(
      "Commit every change before scoring the 80 lines of eval/lines.jsonl, so the history shows Jev's settings " +
        'before any result (EVAL-2)'
    )
  }
  const pin = relayModel()
  const jevRanker = jev(pin)
  const bge = workersAi()
  const rerank = reranker()
  const qwen3 = qwen()
  // Started last, once every key is found, and closed however the run ends, since it keeps the process open.
  const apple = await sentenceEmbedding()
  try {
    const rankers = {
      place,
      keyword,
      embeddings: embeddings(bge),
      jev: jevRanker,
      reranker: rerank,
      qwen3: embeddings(qwen3.documents, qwen3.queries),
      apple: embeddings(apple.embed)
    }
    const atCutOffs = { embeddings: atCutOff, reranker: atCutOff, qwen3: atCutOff, apple: atCutOff }
    const scores = await scoreLines(labeled, phrases, rankers, atCutOffs)
    const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date())
    const out = values.out ?? fileURLToPath(new URL('../results.md', import.meta.url))
    const curves = Object.keys(rankers).map((name) => [naming.ranker(name), riskCoverage(scores.lines, name)] as const)
    // The plots sit beside the report, named after it, so the report's relative links find them.
    const image = `${basename(out, '.md')}-risk-coverage.svg`
    writeFileSync(join(dirname(out), image), plot(curves))
    const fit = reliability(topPhrase(scores.lines, 'jev'))
    const calibration = {
      reliability: fit,
      brier: brier(fit.forecasts),
      image: `${basename(out, '.md')}-reliability.svg`,
      beyondReach: beyondReach(scores.lines)
    }
    writeFileSync(join(dirname(out), calibration.image), reliabilityPlot(fit, naming.jev))
    const run = `${date}, at commit \`${hash}\`${clean ? '' : ' with uncommitted changes'}`
    const { calls } = jevRanker
    writeFileSync(out, render(labeled, scores, { run, file, pin, calls, curves, image, naming, apple, calibration }))
    console.log(`Wrote ${values.out ?? 'eval/results.md'}`)
  } finally {
    await apple.close()
  }
}

if (import.meta.main) await main(process.argv.slice(2))
