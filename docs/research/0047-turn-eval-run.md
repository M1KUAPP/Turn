# Freezing settings for Turn's evaluation run

What issue #40's single run needs from primary sources: what preregistration
says to fix before results are seen and how to report a change, how to read
the relay's deployed vars without changing them, and what Apple documents
about the sentence embedding behind `jev-rerank`. It adds to the [iOS notes]
and the [TRD's rankers]; every source was read on September 23, 2026, and
judgment starts with "Synthesis:".

Contents:

1.  [Findings for the plan](#findings-for-the-plan)
1.  [What to fix before the results are seen](#what-to-fix-before-the-results-are-seen)
1.  [Reporting a deviation or an unwelcome result](#reporting-a-deviation-or-an-unwelcome-result)
1.  [Reading the relay's deployed vars](#reading-the-relays-deployed-vars)
1.  [Apple's sentence embedding on a Mac](#apples-sentence-embedding-on-a-mac)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for the plan

- **Freeze first.** Commit the floor of 0.6, the big-button bar of 0.85,
  the margin of 0.15, the question wording, and the model pin before the
  run: preregistration is "committing to analytic steps without advance
  knowledge of the research outcomes" ([nosek-2018]).
- **Record the conditions.** Synthesis: the report's header carries the
  date, the pin, and the commit, and the TRD says where each threshold came
  from, as NeurIPS asks for "how they were chosen" ([neurips]).
- **Run once.** Synthesis: no re-run after any result is seen; COS: "Once a
  researcher begins to slightly change the way to test the hypothesis, the
  work should be considered exploratory." ([cos-prereg])
- **A failed run.** If the command stops before printing any result, fix
  the cause, log it, and run again from the start: "If the outcomes have
  not yet been observed, Jolene can document the changes to her
  preregistration without undermining diagnosticity." ([nosek-2018])
- **Report all of it.** An unwelcome result goes in the report like any
  other: "Selective reporting of planned analyses is problematic for the
  latter." ([cos-prereg])
- **The relay's vars.** `wrangler deployments status` names the serving
  version but prints no bindings; `wrangler versions view <id> --json`
  prints the version, bindings included ([wrangler-src-status];
  [wrangler-src-view]). A read-only API token needs `Workers Scripts Read`
  ([cf-api-version]).
- **Apple's embedding.** Pin it with `sentenceEmbedding(for:revision:)` and
  record `revision` and `dimension` ([nl-revision]; [nl-dimension]); Apple
  doesn't say a Mac and an iPhone give the same vectors.

## What to fix before the results are seen

- **The plan in advance.** COS: "When you preregister your research, you're
  simply specifying your research plan in advance of your study and
  submitting it to a registry." It adds: "At least one confirmatory test
  must be specified in each preregistration." ([cos-prereg])
- **No choice made after looking.** "A goal of pre-analysis plans is to
  avoid analysis decisions that are contingent on observed results (except
  when those contingencies are specified in advance, see above)."
  ([cos-prereg]) Nosek et al.: "An effective solution is to define the
  research questions and analysis plan before observing the research
  outcomes—a process called preregistration." ([nosek-2018])
- **The idealized model.** The researcher "posts the study design and
  analysis plan to an independent registry before observing the data and
  then reports the outcomes of the analysis according to that plan"
  ([nosek-2018]).
- **Settings and variability.** NeurIPS item 6 asks: "If you ran
  experiments, did you specify all the training details (e.g., data
  splits, hyperparameters, how they were chosen)?" For error bars, "The
  factors of variability that the error bars are capturing should be
  clearly stated" ([neurips]).
- **Conditional analyses.** COS's exception, contingencies "specified in
  advance", covers `jev-rerank`: the [TRD's rankers] already say it runs
  "only when Jev trails `embeddings`".
- Synthesis: the thresholds, the question wording, `JEV_MODEL`'s pin, and
  the bootstrap seed are committed before the run, a plan pushed before it
  sets the `jev-rerank` trigger and every other contingency, and the report
  names the commit it ran on, the date, and the pin.
  Since Jev's answers vary between calls ([TRD's rankers]), the plan says
  which pass is scored before any pass runs, as the TRD already does.

## Reporting a deviation or an unwelcome result

- **Deviations are expected.** "Deviations from data collection and
  analysis plans are common, even in the most predictable investigations."
  ([nosek-2018])
- **Before or after seeing outcomes.** Before: "If the outcomes have not
  yet been observed, Jolene can document the changes to her preregistration
  without undermining diagnosticity." After: "Jolene can transparently
  report changes that were made and why." But "There is certainly increased
  risk of bias with deviations from analysis plans after observing the
  data, even when changes are reported transparently." ([nosek-2018])
- **How to record a change.** COS offers two options once a registration is
  final; option 2 is "Start a Transparent Changes document now.", and
  "Choose option 2 if you have already begun the study." Its advice: "your
  preregistration is a plan, not a prison". "When you write up the results
  of preregistered research, it is important to transparently disclose any
  changes from the proposed plan." ([cos-prereg])
- **Report and interpret everything.** "Selective reporting of planned
  analyses is problematic for the latter." "Selective interpretation of
  pre-planned analyses can disrupt the diagnosticity of statistical
  inferences." ([cos-prereg])
- **Results that go against the hope.** Registered Reports get "an
  in-principle acceptance that will not be revoked based on the outcomes"
  ([cos-rr]); results "are guaranteed to be published regardless of
  findings, as long as the methodology is carried out as described"
  ([cos-prereg]). Nosek et al. cite Franco et al.: in their sample of
  preregistered studies, "70% of published papers failed to report one or
  more of the outcome variables" ([nosek-2018]).
- **NeurIPS answers.** "NA means either that the question is Not Applicable
  for that particular paper or the relevant information is Not Available."
  ([neurips])
- Synthesis: a run that stops before writing its report, with no result
  seen, is run again from the start and logged as a change in the plan;
  once the report exists, nothing is re-run, and any later fix is reported
  as exploratory. If Jev trails `embeddings`, the report's verdict says so,
  and every planned metric stays in it.

[cos-rr]: https://www.cos.io/initiatives/registered-reports

## Reading the relay's deployed vars

- **Versions and deployments.** "A deployment determines which version(s)
  are actively serving traffic." "A version captures the complete state of
  your Worker at a point in time" ([cf-versions]).
- **The commands.** `deployments status`: "View the current state of your
  production"; `deployments list`: "Displays the 10 most recent
  deployments of your Worker"; `versions view [VERSION-ID]`: "View the
  details of a specific version of your Worker". Each takes `--name` and
  `--json`, "Display output as JSON" ([wrangler-cmds]).
- **What `deployments status` prints.** Wrangler's source prints the
  deployment's Created, Author, Source, Message, and each version's
  percentage and ID, with a comment "explicitly not outputting Deployment
  ID"; with `--json` it prints the latest deployment object. It prints no
  bindings ([wrangler-src-status]).
- **What `versions view` prints.** With `--json`, the API's version object
  as is. Without it: Version ID, Created, Author, Source, Tag, Message,
  handlers and compatibility settings, then "Secrets:" with only each
  "Secret Name", then the other bindings through `printBindings`
  ([wrangler-src-view]).
- **Secrets stay hidden.** "The difference is secret values are not visible
  within Wrangler or Cloudflare dashboard after you define them."
  ([cf-secrets]) `wrangler secret list`: "List all secrets for a Worker"
  ([wrangler-cmds]).
- **The REST API.** Under
  `/accounts/{account_id}/workers/scripts/{script_name}`, a `GET` on
  `/deployments` lists deployments: "The first deployment in the list is
  the latest deployment actively serving traffic.", each with `versions`
  of `percentage` and `version_id` ([cf-api-deployments]). A `GET` on
  `/versions/{version_id}` "Retrieves detailed information about a specific
  version of a Worker script.", with `resources.bindings`, a "List of
  bindings attached to a Worker" ([cf-api-version]). A `GET` on `/settings`
  returns bindings too; a `plain_text` entry's `text` is "The text value to
  use." ([cf-api-settings])
- **Permissions.** All three list "Accepted Permissions (at least one
  required)": `Workers Tail Read`, `Workers Scripts Write`, and
  `Workers Scripts Read` ([cf-api-version]).
- **A gap on secrets.** The settings schema's `secret_text` entry also has a
  `text`, "The secret value to use." ([cf-api-settings]); the page doesn't
  say whether a read returns it.
- Synthesis: RELEASE-2's check runs `wrangler deployments status --json`,
  takes the version at 100%, then `wrangler versions view <id> --json`, and
  compares only the `plain_text` bindings (`JEV_MODEL` and the thresholds)
  with the run's frozen values, printing no `secret_text` entry. Neither
  command changes the Worker; a token needs only `Workers Scripts Read`.

[cf-versions]: https://developers.cloudflare.com/workers/configuration/versions-and-deployments/
[wrangler-cmds]: https://developers.cloudflare.com/workers/wrangler/commands/workers/
[cf-secrets]: https://developers.cloudflare.com/workers/configuration/secrets/
[cf-api-deployments]: https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/deployments/methods/list/
[cf-api-settings]: https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/script_and_version_settings/methods/get/

## Apple's sentence embedding on a Mac

The [iOS notes] already cite `sentenceEmbedding(for:)`'s nil return, 512
dimensions from WWDC20, the cosine range, and the concurrency warning. New
here:

- **Platforms.** `sentenceEmbedding(for:)`: iOS 14.0, macOS 11.0, iPadOS,
  Mac Catalyst, tvOS 14.0, visionOS 1.0, and watchOS 7.0; "Retrieves a
  sentence embedding for a given language." ([nl-sentence])
- **Vectors.** `vector(for:)` returns `[Double]?`: "A vector represented as
  an array of doubles if present in the word embedding, otherwise `nil`."
  "This method isn’t safe to call concurrently on a shared `NLEmbedding`
  instance." ([nl-vector])
- **Distance.** `distance(between:and:distanceType:)` defaults to
  `.cosine` and returns "The distance associated with `distanceType`."
  ([nl-distance]); `.cosine` is `1 -` cosine similarity, from 0.0 to 2.0
  ([nl-cosine]). `dimension` is "The number of dimensions in the
  vocabulary’s vector space." ([nl-dimension])
- **Revisions.** `sentenceEmbedding(for:revision:)` "Retrieves a sentence
  embedding for a given language and revision."; also
  `currentSentenceEmbeddingRevision(for:)` and
  `supportedSentenceEmbeddingRevisions(for:)` ([nl-revision]).
- **OS asset or not.** Apple's pages say nothing on whether the sentence
  model ships with the OS or matches between a Mac and an iPhone.
- **Contextual embeddings differ.** `NLContextualEmbedding` (iOS 17, macOS
  14): "A model that computes sequences of embedding vectors for natural
  language utterances."; "Unlike static word embeddings provided by
  `NLEmbedding`, contextual embeddings dynamically adjust based on
  surrounding words, enabling deeper language comprehension." Its app must
  request assets "before computing the embedding to confirm assets are
  available." ([nl-contextual])
- Synthesis: the Mac script loads `sentenceEmbedding(for: .english)`,
  prints its `revision` and `dimension` into the run's log, fails if either
  is missing, and ranks each line's 40 nearest phrases by
  `distance(..., distanceType: .cosine)`, smallest first, on one thread.
  Whether the phone's vectors match is untested; record the phone's
  `currentSentenceEmbeddingRevision(for: .english)` too.

[nl-sentence]: https://developer.apple.com/documentation/naturallanguage/nlembedding/sentenceembedding(for:)
[nl-vector]: https://developer.apple.com/documentation/naturallanguage/nlembedding/vector(for:)
[nl-distance]: https://developer.apple.com/documentation/naturallanguage/nlembedding/distance(between:and:distancetype:)
[nl-cosine]: https://developer.apple.com/documentation/naturallanguage/nldistancetype/cosine
[nl-contextual]: https://developer.apple.com/documentation/naturallanguage/nlcontextualembedding

## Gaps

- Apple's documentation pages render nothing without JavaScript; they were
  read through the JSON each page loads, under
  `developer.apple.com/tutorials/data/documentation/naturallanguage/`.
- PNAS wasn't fetched; Nosek et al. 2018 was read in its PMC copy.
- No swift.org or Apple page on running a script with `swift file.swift`
  or `swift -e` was found in time; the search found only forum posts.
  `swift --help` on this Mac prints the compiler's options.
- Cloudflare's API reference doesn't say whether reading `secret_text`
  returns its `text`.

## See also

- [Turn's evaluation statistics notes](/docs/research/0043-turn-eval-statistics.md)
- [Turn's evaluation services notes](/docs/research/0042-turn-eval-services.md)

[iOS notes]: /docs/research/0023-turn-ios.md#sentence-embeddings-for-a-shortlist
[TRD's rankers]: /docs/TRD.md#the-rankers
[nosek-2018]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5856500/
[neurips]: https://neurips.cc/public/guides/PaperChecklist
[cos-prereg]: https://www.cos.io/initiatives/prereg
[wrangler-src-status]: https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/versions/deployments/status.ts
[wrangler-src-view]: https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/versions/view.ts
[cf-api-version]: https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/versions/methods/get/
[nl-dimension]: https://developer.apple.com/documentation/naturallanguage/nlembedding/dimension
[nl-revision]: https://developer.apple.com/documentation/naturallanguage/nlembedding/sentenceembedding(for:revision:)
