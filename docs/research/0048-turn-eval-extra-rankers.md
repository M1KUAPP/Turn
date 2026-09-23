# Three more rankers for Turn's evaluation

How ticket #45 (EVAL-8) can call `@cf/baai/bge-reranker-base` and
`@cf/qwen/qwen3-embedding-0.6b` on Workers AI, and Apple's sentence embedding
from a Mac helper, over the same 40 phrases. It builds on the [services notes],
the [run notes], and the [evaluation notes]; every source was read on
September 23, 2026, and judgment starts with "Synthesis:".

[evaluation notes]: /docs/research/0025-turn-evaluation.md#choosing-the-embedding-ranker

Contents:

1.  [Findings for the plan](#findings-for-the-plan)
1.  [bge-reranker-base on Workers AI](#bge-reranker-base-on-workers-ai)
1.  [qwen3-embedding-0.6b on Workers AI](#qwen3-embedding-06b-on-workers-ai)
1.  [NLEmbedding's revision API on a Mac](#nlembeddings-revision-api-on-a-mac)
1.  [A Swift helper started from Bun](#a-swift-helper-started-from-bun)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for the plan

- **Same URL shape, new model names.** Both models post to
  `https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/{model}`,
  as in the [services notes], and answer inside the same `result` envelope.
- **Reranker: send `query` and `contexts`.** `query` is a non-empty string,
  `contexts` an array of `{ "text": ... }`, and `top_k` an optional integer of
  at least 1. The answer is `response`, a list of `{ id, score }`, where `id`
  is the context's index in the request.
- **Treat the reranker's score as unbounded.** BAAI says the base reranker's
  score "is not bounded to a specific range", and FlagEmbedding applies a
  sigmoid only when asked. Cloudflare says the score "can be mapped" to
  [0, 1], not that it is. Log the first response's range.
- **Qwen: `queries` for lines, `documents` for phrases.** Each takes a string
  or up to 32 strings, so 40 phrases take two requests. `instruction` is a
  separate string whose default is a web-search one; set Turn's instruction
  there, in English.
- **Qwen's vectors: check, then divide by both norms.** Cloudflare's output is
  only `data` and `shape`; Qwen's card gives 1,024 dimensions and L2
  normalization after last-token pooling. Assert `shape` is `[n, 1024]`.
- **Apple on this Mac: revision 1, 512 dimensions.** A probe on macOS 27.0
  found `revision` 1, `dimension` 512, current revision 1, and supported
  revisions `[1]`. `vector(for: "")` returned nil.
- **Compile the helper once and pipe JSON.** A `swiftc -O` binary started in
  0.01 seconds here, against 0.28 seconds for `swift file.swift`. Node's
  `execFile` caps output at 1 MiB by default, so return ranks or distances,
  not vectors.

## bge-reranker-base on Workers AI

- **Endpoint.** Cloudflare's example posts to
  "https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/baai/bge-reranker-base"
  with `headers={"Authorization": f"Bearer {AUTH_TOKEN}"}` ([cf-rr]).
- **Request.** `query` is `"type": "string", "minLength": 1`, "A query you
  wish to perform against the provided contexts." `top_k` is
  `"type": "integer", "minimum": 1`, "Number of returned results starting with
  the best score." `contexts` is an array of objects whose `text` is a string
  with `"minLength": 1`; "Note that the index in this array is important, as
  the response will refer to it." Only `query` and `contexts` are required,
  and the schema sets no `maxItems` on `contexts` ([cf-rr-json]).
- **Response.** `response` is an array of objects with `id`, "Index of the
  context in the request", and `score`, "Score of the context under the
  index." ([cf-rr-json]) No source states the order when `top_k` is left out;
  "starting with the best score" describes `top_k` only.
- **Types.** `@cloudflare/workers-types` isn't installed in this repository
  (see [Gaps](#gaps)). On workerd's `main`, `Ai_Cf_Baai_Bge_Reranker_Base_Input`
  has `top_k?: number;` and `contexts: { text?: string; }[];`, and the doc
  comment for the query is followed by no `query` property. The output is
  `response?: { id?: number; score?: number; }[]` ([workerd-ai]).
- **Score, per Cloudflare.** The model's description ends: "And the score can
  be mapped to a float value in [0,1] by sigmoid function." ([cf-rr-json]) The
  schema's `score` says nothing on range or sigmoid.
- **Score, per BAAI.** "The reranker is optimized based cross-entropy loss, so
  the relevance score is not bounded to a specific range." ([hf-rr]) The card's
  transformers example returns `model(**inputs, return_dict=True).logits`
  after tokenizing pairs with `max_length=512` ([hf-rr]).
- **Score, per FlagEmbedding.** The `AbsReranker` constructor takes
  `normalize: bool = False`, "If true, normalize the result.", and its
  `max_length` ("Maximum length.") defaults to 512 ([fe-abs]). The
  encoder-only reranker's `compute_score_single_gpu` then runs
  `if normalize: all_scores = [sigmoid(score) for score in all_scores]`
  ([fe-base]).
- **Limits.** The model's JSON lists only a price, with no `context_window` or
  `max_input_tokens` ([cf-rr-json]). Its task is "Text Classification"
  ([cf-rr-json]), and "Rate limits are default per task type"; text
  classification allows "2000 requests per minute" ([cf-limits]).
- **Price.** "$0.00311 per M input tokens" ([cf-rr]).
- Synthesis: one call with 40 short phrases is about 1,000 tokens if each
  pair counts as line plus phrase, or $0.000003. Even at 512 tokens a pair,
  40 pairs cost $0.00006, and 80 lines under $0.01.
- Synthesis: a sigmoid can't change the ranking, and the cross-validated hold
  cut-off works on either scale if the scale stays fixed. Record whether any
  score falls outside [0, 1], which would show raw logits. Sort by `score`
  yourself, map `id` back to the phrase, and fail unless each index from 0 to
  n - 1 appears once.

[cf-rr]: https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/
[cf-rr-json]: https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/workers-ai-models/bge-reranker-base.json
[hf-rr]: https://huggingface.co/BAAI/bge-reranker-base
[fe-abs]: https://github.com/FlagOpen/FlagEmbedding/blob/master/FlagEmbedding/abc/inference/AbsReranker.py
[fe-base]: https://github.com/FlagOpen/FlagEmbedding/blob/master/FlagEmbedding/inference/reranker/encoder_only/base.py

## qwen3-embedding-0.6b on Workers AI

- **Request.** Four optional fields and no `required` list. `queries`,
  `documents`, and `text` each take one string with `"minLength": 1` or an
  array of such strings with `"maxItems": 32`; `text` is described as "Alias
  for documents: a single text string" or "Alias for documents: an array of
  text strings". `instruction` is a string, "Optional instruction for the
  task", with the default "Given a web search query, retrieve relevant
  passages that answer the query" ([cf-qwen-json]).
- **Response.** `data` is an array of arrays of numbers and `shape` an array
  of integers, with no descriptions and no `pooling` field ([cf-qwen-json]).
  workerd's types agree: `data?: number[][]; shape?: number[];` ([workerd-ai]).
- **Who formats the instruction.** Neither Cloudflare's page nor its schema
  says how `instruction` reaches the model, or whether it touches `documents`
  ([cf-qwen]; [cf-qwen-json]).
- **Limits and price.** `context_window` is "8192" and the price "$0.0118 per
  M input tokens" ([cf-qwen-json]). Text embeddings allow "3000 requests per
  minute" ([cf-limits]). No dimension is stated.
- **Qwen's query format.** The card's helper returns
  `f'Instruct: {task_description}\nQuery:{query}'`, with no space after
  `Query:`. Its comments say "Each query must come with a one-sentence
  instruction that describes the task" and "No need to add instruction for
  retrieval documents" ([hf-qwen]).
- **Pooling and normalization.** The card pools with `last_token_pool`, pads
  on the left, and then runs `F.normalize(embeddings, p=2, dim=1)` under
  "normalize embeddings" ([hf-qwen]).
- **Dimension and length.** "Embedding Dimension: Up to 1024, supports
  user-defined output dimensions ranging from 32 to 1024", and "Context
  Length: 32k" ([hf-qwen]).
- **Instruction language.** "In multilingual contexts, we also advise users to
  write their instructions in English, as most instructions utilized during
  the model training process were originally written in English." Also: "Our
  tests have shown that in most retrieval scenarios, not using an `instruct`
  on the query side can lead to a drop in retrieval performance by
  approximately 1% to 5%." ([hf-qwen])
- Synthesis: send lines as `queries` with Turn's instruction and phrases as
  `documents` in separate requests, since no source says how a mixed request
  orders `data`. To learn whether Workers AI formats the instruction, embed one
  made-up line both ways: as `queries` with the instruction, and as
  `documents` with the card's `Instruct: ...\nQuery:` string. A cosine near 1
  means Cloudflare adds the card's format.
- Synthesis: tokens are small. 80 lines at about 30 tokens with the
  instruction, plus about 150 phrases, come to a few thousand tokens, well
  under $0.001.

[cf-qwen]: https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/
[cf-qwen-json]: https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/workers-ai-models/qwen3-embedding-0.6b.json
[hf-qwen]: https://huggingface.co/Qwen/Qwen3-Embedding-0.6B

## NLEmbedding's revision API on a Mac

The [run notes] already cite `sentenceEmbedding(for:)`, `vector(for:)` and its
nil, `distance(between:and:distanceType:)`, `dimension`, the concurrency
warning, and Apple's silence on whether the model ships with the OS. New here:

- **Pinning a revision.** `sentenceEmbedding(for:revision:)` is a class
  method taking `language: NLLanguage` and `revision: Int` and returning
  `NLEmbedding?`, from iOS 14.0 and macOS 11.0 ([nl-sentence-rev]).
- **Current revision.** `currentSentenceEmbeddingRevision(for:)` "Retrieves
  the current version of a sentence embedding for the given language." It
  returns `Int`, "An integer representing the current version number of a
  sentence embedding." ([nl-current])
- **Supported revisions.** `supportedSentenceEmbeddingRevisions(for:)`
  "Retrieves all version numbers of a sentence embedding for the given
  language." It returns `IndexSet`, "An index set representing all of the
  supported version numbers of the sentence embedding." ([nl-supported])
- **Properties.** `revision` is `var revision: Int { get }`, "The revision of
  the word embedding." ([nl-revision]) `dimension` is
  `var dimension: Int { get }` ([nl-dimension]); both date from macOS 10.15.
- **A probe on this Mac.** Made-up sentences only, on macOS 27.0 (`sw_vers`
  build 26A428), Apple Swift version 6.4 (swiftlang-6.4.0.34.1), target
  `arm64-apple-macosx27.0.0`. `sentenceEmbedding(for: .english)` returned an
  embedding with `revision` 1 and `dimension` 512; the current revision was 1,
  the supported set `[1]`, and `vector(for:)` gave 512 numbers. An empty
  string returned nil.
- **Probe timing.** One run each, not a benchmark: loading took 25 ms and the
  first vector 8 ms on the first launch, then 6 ms and 3 ms. The cosine
  distance from "Would you like some tea?" to "Yes, please." was 1.116.
- Synthesis: the program asked for no asset, and the model loaded in
  milliseconds, but that doesn't show whether macOS ships it or fetched it
  earlier. Log `revision`, `dimension`, and the supported set in the run, and
  load with `sentenceEmbedding(for: .english, revision: 1)` so a new revision
  fails loudly instead of changing the vectors.

[nl-sentence-rev]: https://developer.apple.com/documentation/naturallanguage/nlembedding/sentenceembedding(for:revision:)
[nl-current]: https://developer.apple.com/documentation/naturallanguage/nlembedding/currentsentenceembeddingrevision(for:)
[nl-supported]: https://developer.apple.com/documentation/naturallanguage/nlembedding/supportedsentenceembeddingrevisions(for:)
[nl-revision]: https://developer.apple.com/documentation/naturallanguage/nlembedding/revision
[nl-dimension]: https://developer.apple.com/documentation/naturallanguage/nlembedding/dimension

## A Swift helper started from Bun

- **Compile against script.** On this Mac, `swiftc -O probe.swift -o probe`
  built with `import Foundation` and `import NaturalLanguage` and no
  `-framework` flag. `/usr/bin/time -p` gave 0.01 seconds real for the binary
  and 0.28 seconds for `swift probe.swift`, one run each.
- **Standard input.** Node's `execFileSync` takes `input`, "The value which
  will be passed as stdin to the spawned process." ([node-cp])
- **Output cap.** For `execFile`, `maxBuffer` is the "Largest amount of data in
  bytes allowed on stdout or stderr." "If exceeded, the child process is
  terminated and any output is truncated." Its default is `1024 * 1024`
  ([node-cp]).
- Synthesis: a helper of about 30 lines reads one JSON object from standard
  input with `FileHandle.standardInput.readDataToEndOfFile()` and
  `JSONDecoder`, and writes one JSON object with `JSONEncoder` to standard
  output. It pins the revision, uses one `NLEmbedding` on one thread, and
  exits non-zero on a nil embedding or vector.

  ```json
  { "revision": 1, "items": [{ "line": "How was physio?", "phrases": ["It was hard"] }] }
  ```

  ```json
  { "revision": 1, "dimension": 512, "distances": [[0.73]] }
  ```

- Synthesis: 150 phrases at 512 numbers of about 20 characters each is about
  1.5 MB, over `execFile`'s 1 MiB default, so return distances, not vectors.
  From Bun or Node, start the binary with `execFile` from `node:child_process`
  and write the JSON to `child.stdin`, or use `spawn` to stream larger output.
  Vitest can fake the helper, so the tests never need Swift.

[node-cp]: https://nodejs.org/api/child_process.html

## Gaps

- `@cloudflare/workers-types` wasn't found under `node_modules/@cloudflare`,
  `worker/node_modules/@cloudflare` (only `vitest-plugin`), or `.bun`. The
  types were read from workerd's `main` instead, which may differ from any
  published version.
- No source says whether Workers AI returns the reranker's raw logit or its
  sigmoid, how it orders `response` without `top_k`, how many contexts it
  accepts, or whether it cuts long pairs.
- No source says how Workers AI applies Qwen's `instruction`, whether its
  vectors are unit length, or whether it truncates past 8,192 tokens. Qwen's
  GitHub repository wasn't read in time.
- Nothing was run against Workers AI; every shape above is from schemas.
- Node's docs were read from `doc/api/child_process.md` on the `main` branch.
  Bun's own `node:child_process` compatibility and `Bun.spawn` weren't checked.
- No swift.org or Apple page on `swift file.swift` against `swiftc` was read;
  the timing is one run on this Mac. Whether the phone reports the same
  revision is untested.

## See also

- [Turn's evaluation run notes](/docs/research/0047-turn-eval-run.md)
- [Turn's evaluation services notes](/docs/research/0042-turn-eval-services.md)
- [Turn's evaluation statistics notes](/docs/research/0043-turn-eval-statistics.md)
- [Evaluation notes: Apple's NLEmbedding](/docs/research/0025-turn-evaluation.md#apples-nlembedding)

[services notes]: /docs/research/0042-turn-eval-services.md#workers-ais-rest-api-for-bge-base
[run notes]: /docs/research/0047-turn-eval-run.md#apples-sentence-embedding-on-a-mac
[workerd-ai]: https://github.com/cloudflare/workerd/blob/main/types/defines/ai.d.ts
[cf-limits]: https://developers.cloudflare.com/workers-ai/platform/limits/
