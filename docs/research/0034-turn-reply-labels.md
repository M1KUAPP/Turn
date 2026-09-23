# Turn's reply-labeling research notes

What agreement statistics, reply-selection and response-suggestion
evaluations, and studies of language models as labelers say about labeling
Turn's 80 evaluation lines, read for issue #21 on September 23, 2026.
Judgment starts with "Synthesis:".

Contents:

1.  [Agreement on set-valued labels](#agreement-on-set-valued-labels)
1.  [Which candidates count as acceptable](#which-candidates-count-as-acceptable)
1.  [Replies that fit almost any line](#replies-that-fit-almost-any-line)
1.  [Language models as labelers](#language-models-as-labelers)
1.  [Guidelines and independent labeling](#guidelines-and-independent-labeling)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Agreement on set-valued labels

- **Percent agreement.** "The simplest measure of agreement between two
  coders is percentage of agreement", which Scott defined as "the
  percentage of judgments on which the two analysts agree when coding the
  same data independently" ([Artstein and Poesio 2008][artstein]).
- **Kappa's first paradox.** In a two-by-two table of two observers' calls,
  "a high value of p0 can be drastically lowered by a substantial imbalance
  in the table's marginal totals either vertically or horizontally"
  ([Feinstein and Cicchetti 1990][fc1], abstract only).
- **Kappa's second paradox.** The same abstract says kappa is higher when
  the imbalance in marginal totals is asymmetrical rather than symmetrical,
  and that "An adjustment that substitutes kappa max for kappa does not
  repair either problem".
- **Positive and negative specific agreement.** "The problem can be avoided
  only by using ppos and pneg as two separate indexes of proportionate
  agreement in the observers' positive and negative decisions", and "the
  omnibus value of kappa should always be accompanied by separate individual
  values of ppos and pneg" ([Cicchetti and Feinstein 1990][fc2], abstract
  only).
- **The prevalence problem.** Artstein and Poesio name it "the exceeding
  difficulty in getting high agreement values when most of the items fall
  under one category" ([Artstein and Poesio 2008][artstein]).
- **Sets need partial credit.** For set labels (coreference chains, in their
  case), "What is needed is a coefficient that also allows for partial
  disagreement between judgments". Passonneau's earlier distance follows the
  rule "Two sets are minimally distant when they are identical and maximally
  distant when they are disjoint; between these extremes, sets that stand in
  a subset relation are closer (less distant) than ones that merely
  intersect", scoring 0 for equal sets, 1/3 for a subset, 2/3 for an overlap,
  and 1 for disjoint sets (Artstein and Poesio 2008, section 4.4.1).
- **MASI.** "MASI is a distance metric for comparing two sets, much like an
  association measure such as Jaccard (1908) or Dice (1945)." It "ranges
  from 1, when two sets are identical, to 0, when they are disjoint", with
  "MASI = J*M", where "The M term is for monotonicity". "It can be used in
  any weighted agreement metric, such as Krippendorff's Alpha"
  ([Passonneau 2006][masi]).
- **Two ways of writing MASI.** Passonneau's text gives MASI as a score
  that is 1 for identical sets, while Artstein and Poesio write the distance
  as Passonneau's metric dP multiplied by the Jaccard distance dJ.
- **No fixed threshold.** Passonneau quotes Krippendorff (1980) on how
  reliable is reliable enough, "there is no set answer" (p. 146), and argues
  that what counts as sufficiently reliable agreement "depends on the use
  the annotated data will be put to" ([Passonneau 2006][masi]).
- **Not verified: TREC's set overlap.** Voorhees's paper on variations in
  relevance judgments ([Voorhees 2000][voorhees]) returned HTTP 403, so this
  note doesn't quote its overlap measure. See [Gaps](#gaps).
- **No intervals found.** The two 1990 abstracts give no interval method,
  and a text search of Artstein and Poesio for "confidence interval" found
  none. No source read gives intervals for ppos, pneg, kappa, or alpha.
- Synthesis: report the none-versus-some call on the 80 lines as a
  two-by-two table with percent agreement, Cohen's kappa, ppos, and pneg,
  as Cicchetti and Feinstein ask. With at least 16 none lines the margins are
  unbalanced, the case where kappa's paradoxes bite.
- Synthesis: across line-and-phrase pairs (80 lines times the 151 phrases
  outside the strip and the fixed buttons, over 12,000 pairs, plus the fixed
  buttons on yes-or-no lines), almost every pair is "not acceptable", the
  prevalence problem at its worst. Percent
  agreement there will look near perfect and say little, so ppos should be
  the headline for pairs, with kappa and pneg beside it.
- Synthesis: add Krippendorff's alpha with a MASI distance over the 80 sets
  as the one summary number that gives partial credit when one labeler's
  set holds the other's. The script should say which form of the distance
  it uses, since the two sources write it differently.
- Synthesis: the script must define the empty set, because the set rules
  above don't settle it (the empty set is a subset of every set). Count none
  against none as identical (distance 0) and none against any phrase as
  disjoint (distance 1), so a none call is never half right.
- Synthesis: with no interval method read, a bootstrap that resamples the
  80 lines (not the pairs) is a defensible way to put an interval on each
  number; that's this note's suggestion, not a sourced method.

[fc1]: https://europepmc.org/article/MED/2348207
[fc2]: https://europepmc.org/article/MED/2189948
[voorhees]: https://doi.org/10.1016/S0306-4573(00)00010-8

## Which candidates count as acceptable

- **DSTC7's subtasks.** Track 1 posed next-utterance selection with
  "variations with either additional incorrect options, paraphrases of the
  correct option, or no correct option at all", which it says "push the
  next utterance selection task towards real-world dialogue". Subtask 3 had
  "100 candidates, including 1-5 correct options that are paraphrases
  (Advising data only)", and subtask 4 had "100 candidates, including 0-1
  correct options" ([Gunasekara et al. 2019][dstc7]).
- **How DSTC7 built "no correct option".** "For subtask 4 (no correct
  option sometimes), twenty percent of examples were randomly sampled and
  the correct utterance was replaced with an additional incorrect one."
- **DSTC7's right answer is the logged turn.** "To construct the partial
  conversations we randomly split each conversation. Incorrect candidate
  utterances are selected by randomly sampling utterances from the
  dataset." That construction has no human check that a sampled candidate
  doesn't also fit, and a search of the text for "false negative" found
  nothing.
- **Smart Reply's raters checked clusters, not replies.** "The raters are
  provided with a response Ri, a corresponding cluster label C (e.g.,
  thanks) as well as few example responses belonging to the cluster (e.g.,
  “Thanks!”, “Thank you.”) and asked whether Ri belongs to C." A search of
  its text for "agree" found no agreement figure
  ([Kannan et al. 2016][smart-reply]).
- **Smart Reply may show nothing.** "A feedforward neural network decides
  whether or not to suggest responses", and "enforcing diverse semantic
  intents is critical to making the suggestions useful".
- **Multiple references.** Gupta et al. note that benchmarks are "based on
  only a single ground truth reference response for a given context", and
  found that "the use of multiple references results in improved
  correlation between several automatic metrics and human judgement for both
  the quality and the diversity of system output"
  ([Gupta et al. 2019][gupta]).
- **How the references were collected.** "For every HIT, we asked an AMT
  worker to generate 4 diverse follow-up responses for a conversation", and
  "We provided instructions and examples to further clarify the task." In
  their quality check (Table 3), raters judged 41% of the original
  references "Very Appropriate" and 54% "Appropriate", against 40% and 52%
  for the collected ones.
- **ReQA on lexical overlap.** Its "query coverage" is "the percentage of
  tokens in the question that also appear in the answer". "The token
  coverage for ReQA SQuAD is much larger than for ReQA NQ, indicating more
  lexical overlap between the question and answer. This is likely due to the
  original SQuAD construction process whereby writers “back-wrote” questions
  to be answerable by the given documents" ([Ahmad et al. 2019][reqa]).
- **KWickChat not read.** Its ACM page returned HTTP 403 and a title search
  of arXiv's API found no copy, so how it labeled and reported agreement
  isn't covered here ([Shen et al. 2022][kwickchat], metadata only). See
  [Gaps](#gaps).
- Synthesis: EVAL-1's floor of 16 none lines in 80 is 20%, the share DSTC7
  gave its no-correct-option subtask, so the design has a published
  precedent.
- Synthesis: DSTC7 took the logged next turn as the only right answer and
  sampled wrong ones at random. Turn's guide should close that gap: for
  every line the labeler reads the whole bank (the 154 phrases outside the
  strip, with Yes, No, and Not sure only on yes-or-no lines), not just the
  phrase the writer had in mind.
- Synthesis: Gupta et al.'s five-point scale suggests the guide's test: a
  phrase is acceptable if the partner would take it as at least an
  "Appropriate" reply from the user; a phrase that's only "Neutral" isn't.
- Synthesis: ReQA's back-writing effect is the risk when one model writes
  lines against a bank it also wrote. The 10 lines with no shared content
  word measure it; the report could also give the share of lines whose
  acceptable replies share a content word, so keyword ranking's score can be
  read against it.
- Synthesis: Smart Reply's triggering model is the published counterpart of
  Turn's "no change". The none lines test it, so the guide should treat none
  as a positive call, not a skipped line.

[dstc7]: https://aclanthology.org/W19-4107/
[reqa]: https://arxiv.org/abs/1907.04780
[kwickchat]: https://doi.org/10.1145/3490099.3511145

## Replies that fit almost any line

- **The generic-response problem.** "Sequence-to-sequence neural network
  models for generation of conversational responses tend to generate safe,
  commonplace responses (e.g., I don’t know) regardless of the input"
  ([Li et al. 2016][li2016]). Their remedy replaces the likelihood
  objective with maximum mutual information, reported as "yielding
  substantive gains in BLEU scores on two conversational datasets and in
  human evaluations".
- **Smart Reply demotes generic replies.** "we apply some light
  normalization that penalizes responses which are applicable to a broad
  range of incoming messages"; after it, the very generic "Yes!" "has
  fallen out of the top ten" ([Kannan et al. 2016][smart-reply]).
- **Single references reward generic replies.** "automatic evaluation with
  a single-reference may also disproportionately benefit models that
  produce generic responses with more probable words (e.g., “I don’t
  know”)" ([Gupta et al. 2019][gupta]).
- **Not found.** No source read says whether a generic reply should be
  labeled acceptable when it does fit a line.
- Synthesis: the strip's five phrases are never ranked, so they're never
  candidates and never labels; the guide should say so, so "Sorry, say that
  again" is never an acceptable reply.
- Synthesis: a generic phrase counts only when it answers the line as asked:
  "Not sure" fits "Is it raining?", but "OK" doesn't fit "What do you want
  for dinner?". Otherwise a ranker that always offers generic phrases scores
  well, the failure Li et al. and Gupta et al. describe.
- Synthesis: if Yes, No, and Not sure appear on yes-or-no lines whatever
  the ranking, the report could give scores with and without them, so a
  ranker isn't credited for buttons it didn't rank.

[li2016]: https://aclanthology.org/N16-1014/

## Language models as labelers

- **Model against crowd.** On "relevance, stance, topics, and frame
  detection", "the zero-shot accuracy of ChatGPT exceeds that of
  crowd-workers by about 25 percentage points on average, while ChatGPT’s
  intercoder agreement exceeds that of both crowd-workers and trained
  annotators for all tasks" ([Gilardi et al. 2023][gilardi]).
- **What that agreement was.** "For each temperature value, we conducted
  two sets of annotations to compute ChatGPT’s intercoder agreement", so it
  is agreement between two runs of one model. The crowd-workers used "the
  same codebook we developed for our research assistants".
- **Judges and humans.** "strong LLM judges like GPT-4 can match both
  controlled and crowdsourced human preferences well, achieving over 80%
  agreement, the same level of agreement between humans"
  ([Zheng et al. 2023][zheng]).
- **Self-enhancement bias.** Zheng et al. use the term for "the effect that
  LLM judges may favor the answers generated by themselves": "GPT-4 favors
  itself with a 10% higher win rate; Claude-v1 favors itself with a 25%
  higher win rate. However, they also favor other models and GPT-3.5 does
  not favor itself." They add that "our study cannot determine whether the
  models exhibit" the bias.
- **Self-preference follows self-recognition.** Self-preference is when "an
  LLM evaluator scores its own outputs higher than others’ while human
  annotators consider them of equal quality", and fine-tuning showed "a
  linear correlation between self-recognition capability and the strength
  of self-preference bias" ([Panickssery et al. 2024][panickssery]).
- Synthesis: two Claude subagent labelings are closer to Gilardi et al.'s
  two runs of one model than to two people, so their agreement shows
  consistency, not correctness. The report should call it agreement between
  two model labelings and not set it beside human-human figures.
- Synthesis: the lines, the bank, and the labels all come from Claude, and a
  ranker may be Claude too. Self-preference suggests the labels may favor
  choices Claude would make, which would lift the language-model ranker
  against keyword and embedding ranking; the report should say so next to
  the results.
- Synthesis: the cheapest guard is blindness: each labeler gets the guide,
  the line, and the bank, never the other labeling, the writer's intended
  reply, or any ranker's output.
- Synthesis: if a person can spare the time, their own labels on the 16
  none lines and the 10 no-overlap lines would give one human check where
  the risk is highest; that's optional and beyond the team's current plan.

[gilardi]: https://arxiv.org/abs/2303.15056
[zheng]: https://arxiv.org/abs/2306.05685
[panickssery]: https://arxiv.org/abs/2404.13076

## Guidelines and independent labeling

- **Guidelines and reliability.** "If different coders produce consistently
  similar results, then we can infer that they have internalized a similar
  understanding of the annotation guidelines, and we can expect them to
  perform consistently under this understanding." Reliability is "a
  prerequisite for demonstrating the validity of the coding scheme"
  ([Artstein and Poesio 2008][artstein]).
- **Independence.** Scott's definition of agreement, quoted above, assumes
  coders "coding the same data independently", and in the MASI study "The
  annotators worked independently of each other" ([Passonneau 2006][masi]).
- **Not read.** Whether assessor disagreement changes system rankings
  (Voorhees 2000) and published guidance on adjudication weren't read. See
  [Gaps](#gaps).
- Synthesis: write and freeze the guide before the first labeling. A second
  labeling under the same guide measures the guide as much as the labelers,
  so disagreements should become guide edits for a later round, not silent
  fixes to the first.
- Synthesis: report agreement on the two raw labelings, then settle the
  differences into the one label set the rankers are scored on, and say
  how; the settling method here is this note's suggestion, not a sourced
  one.

## Gaps

- Web search was unavailable (the session's search budget was spent), so
  sources were limited to known addresses and open APIs (Europe PMC,
  Crossref, and arXiv).
- Voorhees (2000) returned HTTP 403 at ScienceDirect, and only its Crossref
  metadata was read, so TREC's set-overlap measure and whether assessor
  disagreement changes system rankings are unreported (questions 1 and 5).
- KWickChat's ACM page returned HTTP 403, and arXiv's API found no copy, so
  how it labeled and reported agreement is unread (question 2).
- Feinstein and Cicchetti were read as abstracts only, through Europe PMC's
  API (PubMed showed a cookie notice); the ppos and pneg formulas, worked
  examples, and any intervals are unread.
- No source giving confidence intervals for ppos, pneg, kappa, or alpha with
  MASI was read, and Krippendorff's own texts on alpha weren't read.
- MASI's M-term values weren't found in the extracted PDF text; the set
  distances quoted come from Artstein and Poesio's account of Passonneau's
  earlier metric.
- The DSTC7 text read doesn't show how subtask 4 systems marked "no correct
  option" or how that was scored.
- Published guidance on adjudication wasn't read (question 5).
- Quotes came from PDF text extraction with pypdf, with line-end hyphens
  rejoined; recheck them against the PDFs before quoting them elsewhere.

## See also

- [Turn's evaluation research notes](/docs/research/0025-turn-evaluation.md)
- [PRD evaluation requirements](/docs/PRD.md#evaluation-requirements)

[artstein]: https://aclanthology.org/J08-4004/
[masi]: http://www.lrec-conf.org/proceedings/lrec2006/pdf/636_pdf.pdf
[smart-reply]: https://arxiv.org/abs/1606.04870
[gupta]: https://aclanthology.org/W19-5944/
