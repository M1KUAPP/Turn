# Jev patterns research notes

How far Jev, TypeSafe's hosted decision model, stretches in a demanding app: the
pattern pages, the multi-step cookbooks, the demos, the evals and what TypeSafe
publishes on calibration, what changed since the Jev notes, programs and
licenses, and how Jev pairs with generative and perception models. These notes
extend the [Jev research notes][jev-notes] and link to them instead of repeating
them. Every source was read on September 22, 2026.

Contents:

1.  [Key findings](#key-findings)
1.  [Pattern pages](#pattern-pages)
1.  [Multi-step and real-time cookbooks](#multi-step-and-real-time-cookbooks)
1.  [Demos](#demos)
1.  [Evals, calibration, and consistency](#evals-calibration-and-consistency)
1.  [What changed since the Jev notes](#what-changed-since-the-jev-notes)
1.  [Programs, licenses, and open source](#programs-licenses-and-open-source)
1.  [Jev with generative and perception models](#jev-with-generative-and-perception-models)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

[jev-notes]: /docs/research/jev.md

## Key findings

- **One wide request, then code.** All four pattern pages use a single request
  of one to five questions and route in code ([ts-patterns]). TypeSafe's agent
  skill allows a second request only "when an earlier answer is needed to fetch
  evidence, construct new state, or determine the next options" ([gh-skill-md]).
  See [Pattern pages](#pattern-pages).
- **Chains are short and conditional.** Published chains are two sequential
  requests (skill suggestion, structure recovery), one request per tree level in
  a three-path beam search, and eval workflows whose follow-up requests run only
  when a first reading crosses a probability ([cb-skill-suggestion];
  [cb-autoformat]; [cb-hierarchical]; [ev-support]).
- **Measured speed.** Jev's mean round trip was "111ms" and "114ms" in the
  self-consistency runs of `jev-1.13.0` ([cb-consistency-noul];
  [cb-consistency-choice]). Whole eval cases, some chaining several requests,
  took 0.18 to 1.02 s for Jev and 3.8 to 681 s for Opus 5 and Sol
  ([ev-security-data]; [ev-trace-data]; [ev-invoice-data]).
- **Concurrency.** Cookbook authors keep 3 to 12 requests in flight and warn
  that "the public endpoint rate-limits above roughly eight" ([cb-entity];
  [cb-autoresearch]; see
  [Concurrency in the cookbooks](#concurrency-in-the-cookbooks)). The Doom bot
  ran at "10 queries a second" ([ts-blog-launch]).
- **Cardinality.** A Choice takes up to 255 options and "works reliably up to
  roughly 240", and a Score takes at most ten levels ([ts-choice];
  [cb-classify-confidence]; [cb-autoresearch]). Bigger decisions use two stages,
  as Wikiracing does ([ts-blog-launch]).
- **Evals.** Jev averages 67.8% accuracy against a consensus of GPT-6 Astra and
  Claude Fable 5.1, at $0.0004 and 0.4 s per case, against 74.1% for Sol at
  $0.0836 and 23.3 s. It is near the top on customer service (76.0%) and eighth
  of nine on invoice processing (61.8%) ([ts-evals]).
- **Calibration evidence.** TypeSafe claims calibrated probabilities, but no
  page read publishes a reliability plot or calibration error. The only
  confidence-versus-accuracy split is 27 of 30 right at or above 0.9 against 12
  of 30 below, on 60 filings with `jev-1.12` ([cb-classify-confidence]).
- **Consistency.** Over 15 repeats the top label flipped on 2 of 8 Choice
  questions, with a mean per-question standard deviation near 0.01
  ([cb-consistency-choice]; [cb-consistency-noul]).
- **No demo source.** Doom, Wikiracing, and the smart home assistant have no
  public code; the launch post gives only a few design notes ([ts-blog-launch];
  [ts-smart-home]; [gh-org]).
- **Perception.** TypeSafe says to "Pre-process non-text inputs (images, audio,
  video, binaries) into text or structured fields" and names no speech-to-text,
  OCR, or on-device model ([ts-models]).
- **LLMs have documented roles.** Splitter, router target, verifier, escalation
  target, question proposer, and labeler, with Jev adding "negligible latency"
  in front of an LLM ([ts-smart-home]; [ts-build]; [cb-sde]).
- **Changes since the Jev notes.** The status page lists a new "API
  issues" incident, and the Python SDK docs now show OpenRouter and Vercel AI
  Gateway access. The models page and SDK versions are unchanged ([ts-status];
  [ts-py-usage]).
- **No programs.** No TypeSafe page read offers a student, startup, open-source,
  or hackathon credit; the SDKs and agent skill are MIT-licensed; MCA
  section 16.4 and the under-18 statement are unchanged ([ts-mca];
  [ts-privacy]).

## Pattern pages

The docs index lists four pattern pages and no others: speculative fan-out,
confidence-gated routing, composite scoring, and intent routing ([ts-llms]). The
patterns overview frames them this way: "Learning to think in terms of discrete,
atomic decisions that compose into complex system behavior is a key skill for
getting the most out of TypeSafe." ([ts-patterns]) None of the four pages
reports a measured number; each is one request followed by routing in code.

| Pattern                  | Problem in the example                        | Questions in the one request                        | Thresholds in the example code                               |
| ------------------------ | --------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| Speculative fan-out      | Triage a ticket without a follow-up call      | 5: a 4-option Choice, two 3-level Scores, two Nouls | Severity score > 1.5 and repro noul > 0.6; refund noul > 0.7 |
| Confidence-gated routing | Voice banking actions with different risks    | 1: a 3-option Choice                                | Human below 0.6; a transfer runs above 0.85, else confirm    |
| Composite scoring        | Rank resumes on several dimensions            | 4: Scores with 5 levels each                        | None; weights 0.40/0.10/0.40/0.10 and 0.15/0.40/0.20/0.25    |
| Intent routing           | Send each message to code, an LLM, or a human | 2: a 4-option Choice and a 3-level Score            | Human below 0.5 confidence; complaint escalates if score > 1 |

### Speculative fan-out pattern

- **Problem.** "Because TypeSafe supports sending many questions in a single API
  call, we recommend putting all of the questions your system needs in a single
  request, and then using code to decide what is relevant after the fact. All
  questions are evaluated in parallel, so adding more questions usually has
  little effect on response time." ([ts-fan-out])
- **Speculative questions.** Severity and reproduction steps "only matter if the
  ticket is a bug report", and the refund question only for billing; "If the
  ticket turns out to be a feature request, the bug severity result will be
  irrelevant, in which case your code path simply ignores it." ([ts-fan-out])
- **Result.** "Everything needed for the full decision tree comes from one call.
  Speculative questions are ignored when irrelevant and save a round trip when
  they are not." ([ts-fan-out]) The batching numbers behind this claim are in
  the parallel questions cookbook; see [the latency notes][jev-limits].

The request, as the page shows it ([ts-fan-out]):

```json
{
  "state": "Hi, I placed an order (#98423) last Thursday and was charged twice. I also can't log in after the site update, and adding Apple Pay would be really helpful. This is getting frustrating.",
  "questions": {
    "category": {
      "type": "choice",
      "instructions": "Determine the broad category of this support ticket",
      "criteria": {
        "bug_report": "The user is reporting something that is broken or producing errors",
        "billing": "Charges, invoices, refunds, subscriptions",
        "feature_request": "The user is requesting new functionality",
        "account": "Login, permissions, profile, security"
      }
    },
    "bug_severity": {
      "type": "score",
      "instructions": "How severe is the reported issue",
      "criteria": [
        "Cosmetic; no impact to functionality",
        "Broken or degraded feature; workaround exists",
        "Blocking issue; no workaround exists"
      ]
    },
    "has_reproducible_steps": {
      "type": "noul",
      "instructions": "The user describes specific steps to reproduce the issue"
    },
    "refund_requested": {
      "type": "noul",
      "instructions": "The user is explicitly asking for a refund or credit"
    },
    "frustration": {
      "type": "score",
      "instructions": "How frustrated the user appears",
      "criteria": ["Calm, matter-of-fact", "Frustrated but civil", "Very angry"]
    }
  }
}
```

The routing code that follows, trimmed ([ts-fan-out]):

```python
if category.choice == "bug_report":
    if bug_severity.score > 1.5 and bug_repro.noul > 0.6:
        escalate_to_engineering(ticket_id, severity="high")
    else:
        add_to_bug_backlog(ticket_id)
elif category.choice == "billing":
    if refund.noul > 0.7:
        route_to_billing_with_flag(ticket_id, refund_likely=True)
    # ...
if frustration.score > 1.5:
    flag_for_priority_response(ticket_id)
```

[ts-fan-out]: https://docs.typesafe.ai/patterns/fan-out

### Confidence-gated routing pattern

- **Problem.** In a voice banking interface, "some actions are riskier than
  others and thus demand a higher confidence threshold."
  ([ts-confidence-routing])
- **Thresholds.** "The 0.6 floor catches anything the model is genuinely
  uncertain about." Checking a balance at 0.6 is fine, "But approving a transfer
  requires very high confidence (>0.85), otherwise the system should ask the
  user to confirm." ([ts-confidence-routing])
- **Other pages pick other numbers.** The Confidence page's version of the same
  example routes to a human below 0.5 and needs above 0.9 for a transfer
  ([ts-confidence]); the build guide's example routes to review below 0.8
  ([ts-build]).

```json
{
  "questions": {
    "intent": {
      "type": "choice",
      "instructions": "What action is the user requesting?",
      "criteria": {
        "check_balance": "Check the balance of an account",
        "approve_transfer": "Approve the pending transfer request",
        "other": "Something else"
      }
    }
  }
}
```

### Composite scoring pattern

- **Problem.** "Oftentimes we want to rank a set of items based on several
  criteria at once." The answer is to "break the judgment into independent
  dimensions, score each one separately, and combine them with weights you
  control in code." ([ts-composite])
- **Shape.** One request with four Scores (Python depth, team leadership, system
  design, generalist), five levels each; code divides each score by 4 and
  applies per-role weights ([ts-composite]).
- **Tuning.** "If the highest ranking candidates are not matching your
  expectations, you can adjust the weights to find the right balance."
  ([ts-composite])

The first of the four Scores, and the weighting code ([ts-composite]):

```json
{
  "questions": {
    "python_depth": {
      "type": "score",
      "instructions": "How much depth of python experience does this candidate have, based on the supplied resume?",
      "criteria": [
        "No Python experience mentioned",
        "Mentioned but no detail",
        "Used in projects, some specifics",
        "Primary language, multiple projects",
        "Deep expertise: architecture, performance, libraries"
      ]
    }
  }
}
```

```python
py      = response.answers["python_depth"].score / 4
lead    = response.answers["team_leadership"].score / 4
arch    = response.answers["system_design"].score / 4
general = response.answers["generalist"].score / 4

ic_score = (0.40 * py) + (0.10 * lead) + (0.40 * arch) + (0.10 * general)
em_score = (0.15 * py) + (0.40 * lead) + (0.20 * arch) + (0.25 * general)
```

[ts-composite]: https://docs.typesafe.ai/patterns/composite-scoring

### Intent routing pattern

- **Problem.** "Rather than sending every message through an expensive LLM to
  figure out what kind of request it is, you classify first and route
  accordingly." ([ts-intent])
- **Handlers.** Order status goes to deterministic code, product and return
  questions go to two specialist LLMs, and a complaint goes to a complaint LLM
  or a human depending on complexity ([ts-intent]).
- **Result.** "TypeSafe handles the classification all in a single quick call;
  the expensive resources only get invoked for the requests that actually need
  them." ([ts-intent])

```json
{
  "questions": {
    "intent": {
      "type": "choice",
      "instructions": "The primary intent of this customer message",
      "criteria": {
        "order_status": "Asking about an existing order",
        "product_question": "Asking about a product before buying",
        "return_exchange": "Wants to return or exchange something",
        "complaint": "Unhappy with experience, wants resolution"
      }
    },
    "complexity": {
      "type": "score",
      "instructions": "How complex is this request to resolve",
      "criteria": [
        "Simple lookup or standard procedure",
        "Requires some judgment or multi-step process",
        "Unusual situation, edge case, or escalation needed"
      ]
    }
  }
}
```

```python
if intent.confidence < 0.5:
    return route_to_human_agent(ticket_id)
# ... order_status, product_question, return_exchange
elif intent.choice == "complaint":
    low_confidence = complexity.confidence < 0.5
    if complexity.score > 1 or low_confidence:
        route_to_human_agent(ticket_id)
    else:
        handle_with_llm(ticket_id, COMPLAINT_RESOLUTION)
```

### Patterns in the build guide and agent skill

- **Build guide example.** The guide's closing support-ticket example sends
  seven questions in one request: a Choice with structured criteria, five Nouls,
  and a Score. Code weights three Nouls into a spam risk (0.45, 0.30, 0.25),
  sends a risk between 0.4 and 0.6 or a topic confidence under 0.75 to a human,
  quarantines at 0.6 or more, and marks high priority when frustration
  confidence is at least 0.7 and its score at least 1.5 ([ts-build]).
- **Round trips.** "Decomposition does not require more round trips. Questions
  over the same state run in parallel." ([ts-build])
- **No agent loops.** "Keep deterministic work in code. It is reliable and
  cheap. Avoid agent `while` loops when a software workflow can express the same
  behavior." ([ts-build])
- **Walking a tree.** "To classify into a deep taxonomy, ask one Choice per
  level and walk the tree in code." Options can carry their subtrees, and "The
  `probabilities` on this answer tell you whether the split is close enough to
  explore both branches." ([ts-advanced])
- **Agent skill patterns.** The skill lists six starting shapes: route and fill
  known arguments; select instead of generate; find and judge evidence; turn
  judgments into reusable data; verify and escalate; and respond to changing
  state ([gh-skill-md]).
- **Changing state.** "Code can retain goals and observations while fresh
  judgments guide the next bounded step. Keep inferred state distinct from
  observed facts, and check freshness before applying a result to a changed
  situation." ([gh-skill-md])
- **Thresholds are examples.** "Treat cookbook thresholds and demo results as
  examples to evaluate, not universal rules or permanent model limitations."
  ([gh-skill-md])
- Synthesis: TypeSafe's composition model is wide first and deep only when
  needed. Every question that shares a state rides one request, and a follow-up
  request happens only when an answer changes what state or options exist.

[ts-advanced]: https://docs.typesafe.ai/primitives/advanced

## Multi-step and real-time cookbooks

The [cookbook table in the Jev notes][jev-cookbooks] gives one result per
cookbook. This section adds how decisions chain, how many calls each makes, and
what they measured. The cookbooks index still lists the same 18 recipes, so
there is no newer one ([ts-cookbooks]). Most pin `jev-1.12` and replay cached
answers, for example "Every API call is cached in `json_cache.json`, which ships
with the cookbook, so re-running replays the published numbers instead of
calling the API." ([cb-guardrails]) The two self-consistency cookbooks instead
ran `jev-latest`, which returned `jev-1.13.0` on September 11, 2026
([cb-consistency-noul]).

| Cookbook                                           | How decisions chain                                                            | Requests                    | Questions per request                              | Reported result                                      |
| -------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| [Function calling][cb-function-calling]            | One request per command; code reads only the chosen function's answers         | 1 per command, 14 commands  | "54 questions per command"                         | Confidences from 0.53 to 1.00; no latency or cost    |
| [Hierarchical classification][cb-hierarchical]     | One Choice per tree node; a beam keeps 3 paths per level, up to 12 levels      | Up to 3 parallel per level  | 1 Choice over a node's children                    | Beam matched 4 of 4 leaves, greedy 2 of 4            |
| [Line-by-line search][cb-semantic-find]            | One request per query; two passes proposed past 255 lines                      | 1 per query                 | 2: a Choice over 218 line ids and a Noul           | `exists` at 0.7 or more means answered               |
| [Skill suggestion][cb-skill-suggestion]            | Request 1 ranks 182 skills and gates; request 2 re-checks the top 3            | 2 per turn, at most         | 4, then 4                                          | Wrong loads "from 16.8% to 7.3%"                     |
| [Structure recovery][cb-autoformat]                | Pass 1 joins lines; pass 2 classifies the blocks pass 1 produced               | 2 per document, in sequence | 16, then 62                                        | 10,211 tokens in 0.8 s                               |
| [Re-ranking][cb-rerank]                            | BM25 shortlists 30 candidates; one Noul per query-candidate pair               | 1,200                       | 1 Noul                                             | Top-1 accuracy "from 5% to 18%" for $0.0645          |
| [Guardrails for LLMs][cb-guardrails]               | One request per message; code applies a strict or permissive policy            | 1 per message, 15 messages  | 5: four Nouls and a Score                          | Policy changes flip outcomes with no new call        |
| [SDE cascade][cb-sde]                              | `gpt-5.4-mini` extracts, Jev verifies, `gpt-5.5` re-extracts if any flag fires | 1 Jev request per record    | One Noul per field and check; 9 in the walkthrough | Cascade "up-and-left of every single model"          |
| [Double-checking citations][cb-citation]           | A string match removes fabricated quotes; then one Choice per citation         | 7 for 8 citations           | 1 Choice with 3 options                            | "All four planted failures were caught"              |
| [Classifying RAG passages][cb-rag]                 | Embeddings pick 12 passages; Jev scores each; Claude writes the answer         | "72 in all"                 | 4 Nouls                                            | A contradicting passage routed to its own block      |
| [Self-consistency: nouls][cb-consistency-noul]     | The same request repeated 15 times                                             | 15                          | 14 Nouls                                           | "mean round-trip latency of 111ms"                   |
| [Self-consistency: choices][cb-consistency-choice] | The same request repeated 15 times                                             | 15                          | 8 Choices                                          | "mean round-trip latency of 114ms"                   |
| [Autoresearch][cb-autoresearch]                    | An LLM proposes questions, Jev answers every row, CatBoost fits; 5 rounds      | "2,000 requests" per round  | Up to 18 proposed changes per round                | Held-out RMSE 1.772 against 2.145 for a direct score |

[jev-cookbooks]: /docs/research/jev.md#cookbooks-and-demos
[ts-cookbooks]: https://docs.typesafe.ai/cookbooks

### How decisions chain across calls

- **One request, then code.** Function calling asks every function's arguments
  up front: "Each command is then one request carrying the choice of function
  and every function's arguments, and the dispatcher reads only the chosen
  function's answers." ([cb-function-calling]) Guardrails, line-by-line search,
  date extraction, entity alignment, and classification using confidence also
  end in code, with no second call ([cb-guardrails]; [cb-semantic-find];
  [cb-date]; [cb-entity]; [cb-classify-confidence]).
- **Coarse to fine.** Skill suggestion ranks all 182 skills with three gate
  Nouls in one request, stops if the gate mean is under 0.30, re-checks the top
  3 in a second request, and drops them if the best fit Noul is under 0.30
  ([cb-skill-suggestion]). For bigger rosters: "split it into chunks and rank
  each one, then run this same shortlist step over the winners."
  ([cb-skill-suggestion])
- **Beam search.** Hierarchical classification scores a path as
  "`path_score = product(edge_probabilities) ** (1 / decisions)`" and keeps the
  best three at each level, because with greedy search "One early mistake cannot
  be recovered." ([cb-hierarchical])
- **A dependent second pass.** In structure recovery, "The blocks only exist
  once pass 1 has answered, so this is a second request", and the heading, step,
  and callout questions ride that second request because "waiting for them would
  mean a third round trip" ([cb-autoformat]).
- **Cascades with other models.** The SDE cascade escalates to `gpt-5.5`
  "if _any_ field flag exceeds `FIRE_T`", set to 0.7 ([cb-sde]). The citation
  check skips the model entirely for a quote that isn't in the source: "A quote
  that is not in the source is fabricated, and no model is needed to find that
  out." ([cb-citation])
- **A loop.** Autoresearch runs five fixed rounds. In each, an LLM proposes up
  to 18 changes, Jev answers the new questions for all 2,000 rows, and CatBoost
  refits; a revision or drop stays only if error falls. "Most of the gain is in
  that first call" ([cb-autoresearch]).

The two-request chain in skill suggestion, as the page shows it
([cb-skill-suggestion]):

```python
def suggest(request: str) -> tuple[str, ...]:
    """At most one skill name for a request, or () for "nothing here applies"."""
    wide = rank_wide(request)
    if wide["gate"] < GATE_THRESHOLD:
        return ()
    shortlist = tuple(name for name, _ in wide["ranked"][:SHORTLIST])
    result = rerank(request, shortlist, EXCERPT_CHARS)
    if max(result["fits"].values()) < FITS_THRESHOLD:
        return ()
    return (result["winner"],)
```

### Latency and cost measured in the cookbooks

- **Round trips.** "In this run TypeSafe has a mean round-trip latency of 111ms.
  The LLM conditions range from 1.1 to 13.9 seconds per call under the
  concurrency settings above." ([cb-consistency-noul]) The Choice run reports
  "114ms" against "826ms to 13.0 seconds" ([cb-consistency-choice]). Both were
  15 sequential calls on one input.
- **Per request in a chain.** Skill suggestion's demo requests took "(0.31s)"
  and "(0.16s)" for the wide ranking and "(0.12s)" and "(0.09s)" for the
  re-check ([cb-skill-suggestion]).
- **Question count barely matters.** Structure recovery ran "16 pair questions,
  one request, 0.32s" and "62 questions about 17 blocks, one request, 0.51s"
  ([cb-autoformat]). "An extra question adds little, since the state is most of
  the tokens and is sent once either way, while an extra round trip adds a full
  request of latency." ([cb-autoformat])
- **Concurrency does not remove token cost.** Of 13 separate calls: "Fire them
  concurrently and the gap shrinks, but the 13x token cost stays."
  ([cb-parallel])
- **Cost.** Re-ranking's "1200 TypeSafe calls used 1,536,002 input and 25,200
  output tokens, costing $0.0645." ([cb-rerank]) The self-consistency runs cost
  "$0.000043" and "$0.000046" per call ([cb-consistency-noul];
  [cb-consistency-choice]).

### Concurrency in the cookbooks

- **Entity alignment.** `MAX_WORKERS = 6`, with the comment "small pool; the
  public endpoint rate-limits above roughly eight" ([cb-entity]).
- **Autoresearch.** "Raise the worker pool slowly. Eight is already enough to
  hit a rate limit on a shared key." ([cb-autoresearch])
- **RAG passages.** "One request per passage, four at a time. Keep the pool
  small: the public endpoint rate-limits" ([cb-rag])
- **Skill suggestion and re-ranking.** Eight workers, "gentle on rate limits",
  and twelve for the 1,200 re-ranking calls ([cb-skill-suggestion];
  [cb-rerank]).
- Synthesis: the listed limit of 1,200 requests a minute ([jev-limits]) is not
  what the cookbook authors hit first; they hit rate limits with about eight
  requests in flight on one key. A real-time loop should keep few requests in
  flight and batch questions instead.

### Choice size and high-cardinality decisions

- **Limits.** A Choice "accepts up to 255 options", and the Choice page advises
  giving "the full list of teams, categories, or products rather than a
  shortlist" ([ts-choice]). The classification cookbook says "a Choice works
  reliably up to roughly 240 options" ([cb-classify-confidence]). For Scores,
  "Ten because ten levels is the most a `Score` question takes - eleven comes
  back as a server error." ([cb-autoresearch])
- **Largest sets used.** 218 line ids in one Choice ([cb-semantic-find]), 182
  skills ([cb-skill-suggestion]), and one option per year "from 1900 to 2050,
  plus two escapes" ([cb-date]).
- **Past 255.** Line-by-line search: "Past that, search in two passes: one
  Choice question picks a window of lines, and a second ranks the lines inside
  it." ([cb-semantic-find]) Value extraction: "narrow in two stages: pick the
  section first, then the span inside it." ([cb-pre-parsed]) Wikiracing uses "a
  2 stage-system of scoring independently then making an explicit choice"
  ([ts-blog-launch]).
- **A Choice always picks.** "Choice question probabilities always add up to 1,
  so a line ranks first even when none answer the query." ([cb-semantic-find])
  The cookbooks pair a Choice with a Noul that decides whether to act on it
  ([cb-semantic-find]; [cb-skill-suggestion]).

## Demos

### Doom bot

What the launch post says ([ts-blog-launch]):

- **Rate and cost.** "The engineer behind it was worried about making 10 queries
  a second (which ends up costing ~$7/hour), but the rest of us agreed that was
  lower than expected!"
- **State.** "The demo is on structured state as a data structure with text, not
  on images (yet…)"
- **Why Jev.** "A non-AI doom bot could play better, but we wanted a bot that
  was reactive to different representations of game state, and most importantly…
  following instructions was cool as heck!"
- **Plans.** "we intend to not only release an in-depth walkthrough, but also
  host some events to hack on this."
- **Not stated.** The questions per step, the state schema, the game interface,
  and the loop. The post embeds a [Vimeo video][vimeo-doom] with no text
  description.
- Synthesis: at $0.042 per million input tokens, $7 an hour at 10 queries a
  second implies about 4,600 input tokens per query, and 10 queries a second is
  600 a minute, half the listed rate limit ([jev-limits]).

[vimeo-doom]: https://vimeo.com/1227495732

### Wikiracing agent

What the launch post says ([ts-blog-launch]):

- **Task.** Start on one Wikipedia page and reach another using only links;
  "Each step can mean choosing between hundreds to thousands of links!"
- **High cardinality.** "Jev supports a cardinality up to 255. For the higher
  cardinality choices, we do a 2 stage-system of scoring independently then
  making an explicit choice"
- **Comparison.** "Our speedups here tend to be a lot less than in previous
  demos. That's because this is against the non-reasoning modes of the models
  (except Astra which was set to the lowest reasoning setting). This is also why
  Jev tended to finish in fewer steps (a sign of greater intelligence)."
- **Not stated.** How a page becomes state, how links are scored, and whether
  the goal page is in the state. The post embeds a [Vimeo video][vimeo-wikirace]
  with no text description.

[vimeo-wikirace]: https://vimeo.com/1227495711

### Smart home assistant

- **Fan-out.** "Each user request is evaluated against a long list of questions,
  including many that will end up irrelevant for most requests." For "Turn off
  all of the lights in the house", code reads four answers: category, domain,
  device type, and the action for lights ([ts-smart-home]).
- **Sequential calls rejected.** Asking in stages "optimizes for a minimum
  number of questions, but it ends up being much slower and more expensive than
  batching all of the questions in to one upfront API call." ([ts-smart-home])
- **LLM splitter.** "One of the questions in this demo is a Noul question
  identifying if the user request is asking for more than one distinct action.
  If this is true, the system uses an LLM to split the request into a list of
  atomic commands. The split requests are then evaluated by TypeSafe
  individually." ([ts-smart-home])
- **LLM fallback.** "When TypeSafe determines that the user query is a request
  for general information or conversation, the system calls an LLM to generate a
  freeform response." ([ts-smart-home])
- **Build.** "This demo is a simple Vite/React single-page app that uses the
  TypeSafe API to evaluate user requests. The full source code will be available
  on GitHub at release." ([ts-smart-home]) The page embeds a Loom video titled
  "TypeSafe Smart Home Demo", about six minutes long ([loom-smart-home]).

[loom-smart-home]: https://www.loom.com/share/18c4dbcf8db546dfb2d7f2ef018e78e4

### Side-by-side demo

- **Claim.** "Jev outputs all probabilities in parallel instead of
  autoregressively generating by token." ([ts-blog-launch])
- **Nuance.** "The relatively shorter input paints our model in an advantageous
  light." In the recorded run, the "only disagreement with GPT-5.6 Terra is on"
  the churn likelihood question ([ts-blog-launch]).
- **Homepage counters.** Jev "Cost $0.000081" and "Completed in 0.114s"; LLMs
  "Cost $0.013880" and "Completed in 8.566s" ([ts-home]).

### Source code for the demos

- **Not public.** None of the ten public repositories of the `typesafe-ai`
  organization is a demo: they are the two SDKs, the agent skill, the LLM
  adapter, a Dagger module collection, a cloud-resource dashboard (`Overwatch`),
  the GitHub Pages site, and forks of vLLM, LLaDA, and a Pulumi provider
  ([gh-org]).
- **Closest code.** The JS SDK's `examples/demo.ts` is a four-question ticket
  example, not a launch demo ([gh-js-demo]).
- Synthesis: a team that wants a Doom- or Wikiracing-style loop must design its
  own state encoding and question set; TypeSafe has published only the notes
  above.

[gh-js-demo]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/main/examples/demo.ts

## Evals, calibration, and consistency

### How the workflow evals work

- **Method.** "To automate a task, we decompose the decisions into programmatic
  rules and intelligent judgments." ([ts-evals]) "Averaged across the four
  example tasks, every model is more accurate, cheaper and faster in the
  workflow than it is with the same policy as a prompt." ([ts-evals])
- **Reference labels.** "For this eval, the reference labels are generated via
  an average of the responses of GPT-6 Astra and Claude Fable 5.1, both at high
  thinking, answering every question in the harness. All other models are
  evaluated using the provider's default reasoning settings." ([ts-evals])
- **Accuracy means agreement.** "Each point averages one model configuration's
  accuracy, cost and time over the four workflows with equal weight, against the
  consensus labels." ([ts-evals])
- **Disclosed bias.** The workflows "were not deliberately chosen nor
  constructed to make our model look good, and are not in our training
  distribution. However, they were made by individuals on our model capabilities
  team, so some bias could exist." The reference "biases answers towards OpenAI
  and Anthropic's models." ([ts-blog-launch])
- **Eval policy.** "New evals will be dated snapshots and immediately retired
  once posted rather than hill-climbed." ([ts-antibench]) The launch FAQ adds:
  "We deliberately chose not to publish performance against public benchmarks."
  ([ts-blog-launch])

[ts-antibench]: https://typesafe.ai/blog/antibenchmaxxing

### Results per workflow

Jev's published result for each workflow, with the best workflow result, from
the eval pages; case and question counts come from each page's data file
([ev-security]; [ev-trace]; [ev-invoice]; [ev-support]; [ev-security-data];
[ev-trace-data]; [ev-invoice-data]; [ev-support-data]). The rank among the nine
workflow configurations is this note's ordering of the published numbers.

| Workflow                  | Cases | Questions (Noul, Choice, Score) | Jev accuracy, cost, time per case | Jev rank of 9 | Best workflow result           |
| ------------------------- | ----- | ------------------------------- | --------------------------------- | ------------- | ------------------------------ |
| Security incidents        | 240   | 14 (11, 2, 1)                   | 61.7%, $0.0001, 0.3 s             | 3             | Opus 5: 66.2%, $0.0574, 15.1 s |
| Agent trace observability | 117   | 16 (10, 4, 2)                   | 71.6%, $0.0003, 0.5 s             | 6 (tied)      | Sol: 76.6%, $0.0575, 40.3 s    |
| Invoice processing        | 150   | 191 (115, 76, 0)                | 61.8%, $0.0011, 0.5 s             | 8             | Sol: 79.1%, $0.2152, 34.3 s    |
| Customer service          | 204   | 34 (20, 10, 4)                  | 76.0%, $0.0001, 0.4 s             | 4             | Sol: 78.3%, $0.0323, 10.1 s    |
| Mean of the four          | 711   | Not applicable                  | 67.8%, $0.0004, 0.4 s             | 4 (tied)      | Sol: 74.1%, $0.0836, 23.3 s    |

- **Model identity.** The data files label the TypeSafe model
  `typesafe:v13_snowy_elephant` and Sol `openai:gpt-5.6-sol`
  ([ev-support-data]).
- **Launch claim.** "Jev is off the charts – owning the Pareto frontier for
  almost 2 orders of magnitude." ([ts-blog-launch])
- **Type safety.** The launch post's charts show a 0% structured-output error
  rate and a 0% tool-call error rate for Jev, against 0.58% to 45.5% and 0.67%
  to 17.0% for the LLMs shown, with the caveats "The numbers for LLMs are from
  OpenRouter" and "Our number is not empirical. Schema matching is guaranteed"
  ([ts-blog-launch]).

### How the eval workflows chain decisions

- **Security incidents.** Three questions first: "was the activity unauthorized,
  does a record explain it, and how strong is the evidence?" Code acts when the
  activity is probably unauthorized ("P > 0.75"), notifies the user for identity
  alerts in "the grey zone (0.15–0.60)", and "Acting opens eleven more
  questions" before a playbook picks the response ([ev-security]).
- **Customer service.** "Eleven readings of the conversation at once", then
  "Four follow-ups, plus a tie-break when two intents are close. Each runs only
  when the first reading calls for it" ([ev-support]). The gates, from the
  page's flowchart:
  - Fraud runs when "unauthorized activity is in play (P ≥ 0.30, or it leads the
    intents)".
  - Money runs when "money is on the table (P ≥ 0.20 or a money intent leads)
    and a claim or fee is on file".
  - Retention runs when "cancelling is in play (P ≥ 0.15 with an active
    subscription, or it leads)".
  - The tie-break runs when "the two leading intents are within 0.25 of each
    other".
  - The assistant's own messages are then checked against the record, and "Nine
    sections run top to bottom" to emit actions such as fixed "SAY" messages.
- **Agent trace observability.** Irreversible actions are checked first, and "A
  breach pages on-call and the review ends there"; then task completion and
  satisfaction pick one of four outcomes, each of which "asks one further
  question and then ends the review" ([ev-trace]).
- **Invoice processing.** "Seven rounds of questions, one subject at a time.
  Sums, dates, account numbers and statuses are computed in code rather than
  asked." ([ev-invoice])
- **Timing of whole cases.** In the five example cases per workflow, Jev
  finished a security case in 0.176 to 0.338 s with one or two question groups
  ("nodes" in the data), a customer-service case in 0.285 to 0.560 s with two to
  five groups, an agent-trace case in 0.410 to 1.022 s, and an invoice case with
  26 to 80 questions in 0.416 to 0.650 s. Opus 5 and Sol took 3.8 to 681 s on
  the same cases ([ev-security-data]; [ev-support-data]; [ev-trace-data];
  [ev-invoice-data]).

### Where Jev is strong and weak

- **Strong.** Customer service, a conversational workflow with many follow-ups,
  is Jev's best result, 2.3 points behind the top. On security incidents Jev
  ranks third, behind Opus 5 and Sol and ahead of the other six ([ts-evals]).
- **Weak.** Invoice processing is Jev's worst, 17.3 points behind Sol and ahead
  of only Haiku 4.5 ([ts-evals]). Its inputs are line items, totals, tax,
  contracts, and prior invoices ([ev-invoice]).
- **TypeSafe's own description.** "Jev is designed for common-sense judgments:
  classifying content, routing requests, scoring responses, and evaluating
  information." and "Some tasks requiring extended reasoning, such as complex
  mathematics or chess-like planning, may be better suited to large reasoning
  models." ([ts-home])
- **Known failure modes.** Numbers, dates, indirection, and noisy state are
  covered in [the jaggedness summary][jev-jagged]. The page adds that
  "`jev-1.13` will perform better on semantic representations than numeric" and
  advises: "do the conversion in code and pass in either the computed number or
  a named bucket." ([ts-jagged])
- Synthesis: the weakest eval is the one richest in amounts and documents,
  matching the jaggedness page. Decisions over language, intent, tone, and
  policy fit Jev; arithmetic, dates, and exact matching belong in code.

[jev-jagged]: /docs/research/jev.md#known-limitations-on-the-jaggedness-page

### Calibration claims and evidence

- **The claim.** "Higher probability should correspond to a greater chance that
  the answer is correct." and "These rates describe groups of predictions, not a
  guarantee about any single answer." ([ts-primer]) The launch post says
  "Calibrated: higher confidence means higher accuracy." ([ts-blog-launch])
- **Published evidence.** No reliability plot, expected calibration error, Brier
  score, or log loss appears on the primer, the Confidence page, the launch
  post, the eval site, or any cookbook read. The eval site measures agreement
  with reference labels, not calibration ([ts-evals]).
- **The one split.** "The confident half is right 90% of the time; the other
  half, 40%. Reported one level up, that 40% becomes 70%." That is 27 of 30 and
  12 of 30 at a 0.9 cutoff, on 60 filings with `jev-1.12`
  ([cb-classify-confidence]).
- **Disclaimers.** The self-consistency cookbooks call their bands
  "illustrative" and "neither a calibrated guarantee nor an optimized threshold"
  ([cb-consistency-noul]; [cb-consistency-choice]). The jaggedness page says
  "`jev-1.13`'s score levels are weak in numerical calibration." ([ts-jagged])
- **Do it yourself.** "Test thresholds by plotting confidence against accuracy
  on your data." ([ts-build]) "System One models are trained for calibrated
  decisions; validate their performance in the target domain." ([gh-skill-md])
- **Confidence is undocumented.** `confidence` is "a statistic computed from the
  probability distribution", and a cookbook on how to compute it is promised:
  "will add the link here when we do!" ([ts-confidence]) It differs from the top
  probability: structure recovery prints "confidence 0.43: paragraph 0.53,
  list_item 0.24, callout 0.19" ([cb-autoformat]).

[ts-primer]: https://docs.typesafe.ai/introduction/machine-learning-primer

### Consistency results

- **Nouls.** "TypeSafe's mean per-question probability standard deviation is
  `0.0102`, below all LLM probability conditions here." One question, `covered`,
  crossed 0.5 across repeats ([cb-consistency-noul]).
- **Choices.** "TypeSafe flips on 2 of the 8 questions." Its raw agreement
  was 90.8%; a 0.60 floor raised policy agreement to 99.2% while sending 25.8%
  of answers to review. Haiku 4.5 at temperature 0 agreed 100% of the time, and
  the page warns "This experiment does not measure accuracy."
  ([cb-consistency-choice])
- **Batching.** "Choices, scores, and six of the eight nouls come back identical
  across the 5 repeats" whether the 13 questions went in one request or thirteen
  ([cb-parallel]).
- **Method caveat.** Each repeat changed a `uid` field, so "This setup cannot
  separate sensitivity to the irrelevant field from variation that would occur
  on identical requests." ([cb-consistency-noul])
- **TypeSafe's framing.** "Determinism means returning the same result for an
  identical input. This is less valuable than consistency. We define consistency
  as making similar decisions when the meaning stays similar, even if the
  wording changes. Jev is designed for consistency." ([ts-home])

## What changed since the Jev notes

The Jev notes were committed at 18:03 and 20:40 UTC on September 21, 2026, early
on September 22 at UTC+8 (`git log`). This comparison uses what those notes
record.

| Item                   | In the Jev notes                                 | Live on September 22, 2026                                      | Changed                  |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------------------- | ------------------------ |
| Docs index             | 4 patterns, 18 cookbooks, 1 demo                 | Same set; also lists "Jev with coding agents"                   | No new pattern or recipe |
| Models page            | `jev-1.13.0`, $0.042 per million, 1,200 RPM, 64k | Same version, aliases, prices, limits, and context length       | No                       |
| Python SDK             | PyPI 0.7.1; docs changelog stops at 0.7.0        | PyPI 0.7.1; docs changelog lists v0.7.1 and AI gateway examples | Docs caught up           |
| JavaScript SDK         | 0.6.0                                            | 0.6.0 on npm and in the changelog                               | No                       |
| HTTP API               | v1; OpenAPI document version 0.2.0               | Version 0.2.0 with the same two paths                           | No                       |
| Status page            | "99.841% uptime"; one incident                   | "99.840% uptime"; a second incident, "API issues"               | Yes                      |
| MCA and privacy policy | MCA of Sep 19, 2026; under-18 statement          | Same dates and text                                             | No                       |

- **Docs index.** The live index has the same four patterns, 18 cookbooks, and
  one demo ([ts-llms]). It also lists "Jev with coding agents", which the Jev
  notes don't cite; the sitemap dates it 2026-09-21T18:14:36Z, between the
  notes' two commits ([ts-coding-agents]; [ts-sitemap]). The page says "Jev
  is **not** a drop-in replacement for the LLM behind Claude Code, Cursor,
  opencode, Copilot, Muse Spark, Grok Bot, or similar tools."
  ([ts-coding-agents])
- **Sitemap restamp.** 61 of the sitemap's 111 pages now carry a date of
  2026-09-22 at 05:54:44 UTC: the models page, 53 JavaScript SDK pages, six
  cookbooks, and the cookbooks index ([ts-sitemap]). Their text still matches
  the Jev notes' quotes, except two cookbook phrases listed under
  [Conflicts between sources](#conflicts-between-sources).
- **Models page.** Still `jev-1.13.0` behind `jev-latest` and `jev-preview`,
  "$42 / $0.042" per billion or million tokens, "250,000 tokens per second /
  1,200 requests per minute", and "64k tokens per request; 32k tokens for
  `state` plus the longest question" ([ts-models]).
- **SDK releases.** No new release: PyPI's latest is 0.7.1 from 2026-09-21 and
  npm's is 0.6.0 from 2026-09-15 ([pypi-sdk]; [npm-registry]). The Python docs
  changelog now shows "v0.7.1 (2026-09-21)" with "add examples for usage with AI
  gateways" ([ts-py-changelog]); the JS changelog still tops out at "v0.6.0
  (2026-09-15)" ([ts-js-changelog]).
- **HTTP API.** The live OpenAPI schema is still version 0.2.0, with only
  `/v1/systemone` and `/v1/models` ([ts-openapi]).
- **AI gateways.** The Python usage page now says "connect through an AI gateway
  using its API key and model ID", with OpenRouter
  (`base_url="https://openrouter.ai/api"`, `model="~typesafe/jev-latest"`) and
  Vercel AI Gateway (`base_url="https://ai-gateway.vercel.sh/typesafe"`,
  `model="typesafe-ai/jev"`) examples, adding "This requires the alternative API
  to follow the TypeSafe OpenAPI spec" ([ts-py-usage]). The Jev notes had
  OpenRouter only as an unverified community report ([jev-surfaces]). The linked
  OpenRouter page describes Jev at "$0.042 per million input tokens, $0 per
  million output tokens" ([or-jev]), and Vercel's page is titled "TypeSafe API
  with AI Gateway" ([vercel-typesafe]).
- **Status page.** "All services are online" and "99.840% uptime" for
  `api.typesafe.ai`, last updated Sep 22, 2026 at 8:49am UTC ([ts-status]). A
  new incident, "API issues", affected `api.typesafe.ai` and was "Resolved Sep
  21, 2026 at 11:40pm UTC" with the note "We are seeing intermittent downtime
  and system instability. We are actively investigating." ([ts-incident-api])
- **Launch post FAQ.** The Jev notes say the page source lacks the answers to
  "Where does our training data come from?" and "How does Jev perform against
  public benchmarks?" ([jev-gaps]). The serialized page data holds them: "We
  make all the data ourselves. We wouldn't train on your data even if you asked
  us to (no offense)." and "We deliberately chose not to publish performance
  against public benchmarks." ([ts-blog-launch])
- **Community reports since the Jev notes (secondary).** An issue filed at
  23:15 UTC on September 21 says every console sign-in attempt returned HTTP 500
  for two days and that the status page "only monitors `api.typesafe.ai`"
  ([gh-skills-10]); no maintainer had replied, and the login page itself loaded
  normally on September 22 ([ts-console]). On a request for cached criteria, a
  user reports "80k-100k calls/day in production" with a fixed criteria block of
  "~650 tokens" per call ([gh-js-10]).
- **Repositories.** No SDK, skill, or adapter repository has been pushed to
  since the notes: the Python SDK's last push was 2026-09-21T15:57Z, the JS
  SDK's 2026-09-15, the skill's 2026-09-12, and the adapter's 2026-09-18
  ([gh-org]).

[ts-sitemap]: https://docs.typesafe.ai/sitemap.xml
[ts-py-changelog]: https://docs.typesafe.ai/sdk/python/changelog
[ts-js-changelog]: https://docs.typesafe.ai/sdk/javascript/changelog
[jev-surfaces]: /docs/research/jev.md#jev-product-surfaces
[or-jev]: https://openrouter.ai/~typesafe/jev-latest/
[vercel-typesafe]: https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe
[ts-incident-api]: https://status.typesafe.ai/incident/1070670
[jev-gaps]: /docs/research/jev.md#gaps
[ts-console]: https://console.typesafe.ai/login

## Programs, licenses, and open source

### Programs and credits

- **None found.** No TypeSafe page read offers a student, education, startup,
  open-source, or hackathon program, credit, or discount. The search covered the
  site's sitemap pages, every page in the docs index, and the legal pages
  ([ts-llms]; [ts-home]).
- **Credits in the MCA.** The only credit mechanism is the MCA's discretionary
  Promotional Credits, covered in [the Jev notes][jev-programs] ([ts-mca]).
- **Closest thing to an event.** The Doom demo: "we intend to not only release
  an in-depth walkthrough, but also host some events to hack on this."
  ([ts-blog-launch])
- **Speed on request.** "Can you make Jev even faster?" is answered "yes we can.
  If you have a use case that needs a speedier Jev, contact us at
  sales@typesafe.ai and tell us more." ([ts-home])

[jev-programs]: /docs/research/jev.md#free-tier-credits-and-programs

### Licenses of TypeSafe's public repositories

| Repository                  | License    | What it is                                                               |
| --------------------------- | ---------- | ------------------------------------------------------------------------ |
| `typesafe-sdk-python`       | MIT        | Official Python SDK; its LICENSE reads "Copyright (c) [year] [fullname]" |
| `typesafe-sdk-js`           | MIT        | Official JavaScript and TypeScript SDK; "Copyright (c) 2026 TypeSafe"    |
| `skills`                    | MIT        | Agent skill; SKILL.md front matter says `license: MIT`                   |
| `system-one-adapter-python` | MIT        | LLM-backed stand-in for the System One API                               |
| `daggerverse`               | Apache-2.0 | Dagger modules                                                           |
| `vllm`                      | Apache-2.0 | Fork of vLLM                                                             |
| `LLaDA`                     | MIT        | Fork of the Large Language Diffusion Models code                         |
| `pulumi-clickhouse`         | Apache-2.0 | Fork of a Pulumi provider for ClickHouse Cloud                           |
| `Overwatch`                 | None       | "a local browser service for cloud resources and training workloads"     |
| `typesafe-ai.github.io`     | None       | GitHub Pages site                                                        |

- **Sources.** Licenses come from GitHub's repository metadata and each LICENSE
  file ([gh-org]; [gh-py-license]; [gh-js-license]; [gh-skill-md]). PyPI and npm
  also list MIT ([pypi-sdk]; [npm-registry]).
- **Contributions.** "We are not accepting pull requests at this moment, but we
  plan to move to a public development model in the future!"
  ([gh-py-contributing])
- **Cookbook code.** The cookbook pages state no license and install a
  `cooksafe` helper from TypeSafe's own package index,
  `https://pypi.typesafe.ai/` ([cb-parallel]).

[gh-js-license]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/main/LICENSE
[gh-py-contributing]: https://github.com/typesafe-ai/typesafe-sdk-python/blob/main/CONTRIBUTING.md

### Keys in open-source code

- **No dedicated page.** No TypeSafe page addresses apps or open-source projects
  that publish code calling Jev.
- **What exists.** The agent skill ends with "Keep API credentials server-side
  in web apps." ([gh-skill-md]) The SDKs read `TYPESAFE_API_KEY` from the
  environment, and the gateway examples read `OPENROUTER_API_KEY` or
  `AI_GATEWAY_API_KEY` the same way ([ts-py-usage]). The MCA's credential clause
  and the SDKs' logging and browser guards are in [the Jev notes][jev-keys].
- Synthesis: a public repository can hold the calling code as long as the key
  stays in environment variables or a secret store; nothing TypeSafe publishes
  forbids open-sourcing the code, and the MCA's confidentiality duty attaches to
  the key.

[jev-keys]: /docs/research/jev.md#installing-an-sdk-and-authenticating

### Publicity clause and under-18 statement

- **MCA section 16.4, unchanged.** The MCA still says "Last updated Sep 19,
  2026", and section 16.4 reads in full: "Nothing in this Agreement grants
  either Party the right to use the name, brand, or logo of the other Party, and
  neither Party may publicly announce that the Parties have entered into the
  Agreement, except with the other Party's prior consent or as required by Laws;
  provided, however, that TypeSafe may use the name, brand, or logo of Customer
  (or Customer's parent company) for the purpose of identifying Customer as a
  licensee or customer on TypeSafe's website or in other promotional materials,
  or as part of a list of TypeSafe's customers in a press release or other
  public relations materials announcing Customer's use of the Services. TypeSafe
  will cease further use of such assets at Customer's written request."
  ([ts-mca])
- **Privacy policy, unchanged.** Last updated Nov 19, 2025: "We do not knowingly
  collect, maintain, or use personal data from children under 18 years of age,
  and no part of the Services is directed to children." ([ts-privacy])

## Jev with generative and perception models

### Generative models

Roles that TypeSafe's own pages give an LLM next to Jev:

- **Splitter.** The smart home demo uses an LLM to split a compound request,
  then evaluates each part with Jev ([ts-smart-home]).
- **Handler behind a router.** Intent routing sends two intents to specialist
  LLMs ([ts-intent]); the use-case map suggests "Use Jev to build a custom
  router that chooses which LLM receives each prompt." ([ts-use-cases])
- **Conversational fallback.** The smart home demo calls an LLM for general
  questions, and "The initial TypeSafe response is so fast compared to the LLM
  response that it adds negligible latency to the overall system."
  ([ts-smart-home])
- **Guard and verifier.** Guardrails screen LLM inputs and outputs in one
  request per message; a second LLM guard would mean "you pay a call's worth of
  latency and money on every turn, and an attacker can talk that one past too."
  ([cb-guardrails]) The SDE cascade verifies `gpt-5.4-mini` output and escalates
  to `gpt-5.5` ([cb-sde]); the citation check verifies an LLM's citations
  ([cb-citation]).
- **Filter before generation.** "We use TypeSafe to score each retrieved
  passage, OpenAI to embed the corpus for the search step, and Claude to write
  the final answer out of whatever survives the scoring." ([cb-rag])
- **Escalation target.** "Escalate uncertain cases to a person or a more
  expensive reasoning model." ([ts-build])
- **Proposer and labeler.** In autoresearch, "An LLM proposes the questions,
  TypeSafe answers them for every row, and CatBoost trains on the answers."
  ([cb-autoresearch]) The build guide suggests "an ensemble of expensive
  reasoning models" to label data ([ts-build]). Value extraction takes
  candidates "from a named-entity recognizer or an LLM that proposes them"
  ([cb-pre-parsed]).
- **Not a coding-agent model.** Jev can't replace the model behind a coding
  agent ([ts-coding-agents]).

### Non-text input and perception

- **Text only.** "Pre-process non-text inputs (images, audio, video, binaries)
  into text or structured fields before sending them as `state`." ([ts-models])
  The State page says "Images, audio, and video are not supported (yet)."
  ([ts-state])
- **State can be app state.** State "could be a support message, a passage of
  text, or the current state of your application." ([ts-state]) The Doom bot
  read "structured state as a data structure with text, not on images (yet…)"
  ([ts-blog-launch]).
- **Numbers into buckets.** For numeric inputs such as colors, "do the
  conversion in code and pass in either the computed number or a named bucket."
  ([ts-jagged])
- **Voice.** The confidence-gated routing pattern is set in "a voice banking
  interface" but describes no transcription step ([ts-confidence-routing]).
- **Transcripts.** The use-case map mentions "Process call transcripts to
  extract customer issues, commitments, and follow-up actions." ([ts-use-cases])
- **Attachments as labels.** The Noul consistency cookbook puts
  `"repair estimate (PDF)"` and `"8 damage photos"` into the state as plain
  text, without reading them ([cb-consistency-noul]).
- **Embeddings.** The RAG cookbook retrieves with `text-embedding-3-small`
  before Jev scores passages ([cb-rag]).
- **Positioning.** The manifesto calls the goal "the dream of neuro-symbolic AI:
  neural networks for perception paired with symbolic logic for reasoning"
  ([ts-manifesto]). The use-case map says "Frontier intelligence at real-time
  speeds (150ms) means AI can make decisions faster than human perception."
  ([ts-use-cases])
- **Not found.** No TypeSafe page names a speech-to-text engine, OCR, a vision
  model, or an on-device model as a partner for Jev.

[ts-manifesto]: https://typesafe.ai/manifesto

## Conflicts between sources

- **Choice size.** The API accepts "a maximum of 255 options per Choice", and
  the Choice page advises the full list ([ts-api]; [ts-choice]); the
  classification cookbook says "a Choice works reliably up to roughly 240
  options" ([cb-classify-confidence]).
- **Rate limits.** The models page lists 1,200 requests a minute ([ts-models]);
  cookbooks say "the public endpoint rate-limits above roughly eight" in flight
  ([cb-entity]; [cb-autoresearch]).
- **Price status.** The models page gives $0.042 per million input tokens as
  current ([ts-models]); the self-consistency cookbooks label it "Historical
  TypeSafe rate, as of 2026-08" and their costs "not verified `jev-latest`
  prices" ([cb-consistency-noul]).
- **Structure recovery cost.** The printed total is "$0.0003", while the page's
  text says "$0.0015" ([cb-autoformat]).
- **Choice confidence.** Structure recovery describes type confidence as "the
  probability behind the winning choice" but prints 0.43 for a 0.53 winner
  ([cb-autoformat]); function calling defines its own call confidence as "the
  least certain judgement in the call" ([cb-function-calling]).
- **Beam requests.** The hierarchical cookbook says its "TypeSafe API calls each
  simultaneously evaluate `K` paths", while its code sends one single-question
  request per path in parallel ([cb-hierarchical]).
- **Example thresholds.** Confidence floors differ across pages for similar
  decisions: 0.6 ([ts-confidence-routing]), 0.5 ([ts-confidence];
  [ts-intent]), 0.75 and 0.8 ([ts-build]).
- **Console health.** The status page shows the console incident resolved on
  September 21 and all services online ([ts-status]); a community issue reports
  console sign-in failing with HTTP 500 into September 22 ([gh-skills-10]).
- **Corrections to the Jev notes.** Two cookbook phrases they quote are not on
  the live pages: entity alignment has no "carries the whole decision"
  ([cb-entity]), and skill suggestion now says "reduce incorrect skill loads by
  more than half" instead of "drop by more than half" ([cb-skill-suggestion]).
  Their conflict about the Python docs changelog is resolved, and the launch
  post's FAQ answers are in the page data (see
  [What changed since the Jev notes](#what-changed-since-the-jev-notes));
  the notes' other conflicts are in [their own list][jev-conflicts].

[jev-conflicts]: /docs/research/jev.md#conflicts-between-sources

## Gaps

What TypeSafe's pages don't say that an ambitious app needs, as of September 22,
2026:

- **Demo internals.** The Doom bot's state schema, questions per step, and loop;
  how Wikiracing encodes a page; and the smart home source promised "at release"
  ([ts-blog-launch]; [ts-smart-home]).
- **Real-time numbers.** Percentile latency, latency from outside the US West
  Coast, throughput under concurrency, and whether rate limits count requests in
  flight, per minute, or per key ([ts-models]; [cb-entity]).
- **Streaming or batch.** No streaming, WebSocket, or batch endpoint is
  documented; the live OpenAPI schema lists only `/v1/systemone` and
  `/v1/models` ([ts-api]; [ts-openapi]).
- **Calibration data.** Reliability curves or error measures for `jev-1.13.0`,
  per-question eval accuracy, and the formula behind `confidence`
  ([ts-confidence]; [ts-evals]).
- **Eval cases.** Only five example cases per workflow are published, not the
  full sets of 117 to 240 ([ev-support-data]).
- **Repeated criteria.** Whether a fixed criteria block can be cached or
  registered once; a community request has no answer ([gh-js-10]).
- **Programs.** Any student, startup, open-source, or hackathon credit, and
  whether the Doom hack events will happen ([ts-blog-launch]; [ts-mca]).
- **Open-source guidance.** Anything on publishing an app that calls Jev, and
  the Python SDK's unfilled copyright line ([gh-py-license]).
- **Perception.** Any guidance on speech-to-text, OCR, or on-device models, and
  a date for image or audio input ([ts-models]; [ts-state]).
- **Gateway terms.** Whether OpenRouter or Vercel AI Gateway access is open to
  new accounts, and at what limits ([ts-py-usage]).

[ts-patterns]: https://docs.typesafe.ai/patterns
[gh-skill-md]: https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md
[cb-skill-suggestion]: https://docs.typesafe.ai/cookbooks/skill_suggestion
[cb-autoformat]: https://docs.typesafe.ai/cookbooks/autoformat
[cb-hierarchical]: https://docs.typesafe.ai/cookbooks/hierarchical_classification
[ev-support]: https://evals.typesafe.ai/customer_service.html
[cb-consistency-noul]: https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook
[cb-consistency-choice]: https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook
[ev-security-data]: https://evals.typesafe.ai/security_incidents-cases.js
[ev-trace-data]: https://evals.typesafe.ai/agent_trace_observability-cases.js
[ev-invoice-data]: https://evals.typesafe.ai/invoice_processing-cases.js
[cb-entity]: https://docs.typesafe.ai/cookbooks/entity_alignment
[cb-autoresearch]: https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery
[ts-blog-launch]: https://typesafe.ai/blog/introducing-system-one-models-and-jev
[ts-choice]: https://docs.typesafe.ai/primitives/choice
[cb-classify-confidence]: https://docs.typesafe.ai/cookbooks/classification_using_confidence
[ts-evals]: https://evals.typesafe.ai/
[ts-smart-home]: https://docs.typesafe.ai/demos/smart-home
[gh-org]: https://github.com/typesafe-ai
[ts-models]: https://docs.typesafe.ai/models
[ts-build]: https://docs.typesafe.ai/concepts/how-to-build-with-system-one
[cb-sde]: https://docs.typesafe.ai/cookbooks/sde_cascade
[ts-status]: https://status.typesafe.ai/
[ts-py-usage]: https://docs.typesafe.ai/sdk/python/usage
[ts-mca]: https://typesafe.ai/legal/mca
[ts-privacy]: https://typesafe.ai/legal/privacy-policy
[ts-llms]: https://docs.typesafe.ai/llms.txt
[jev-limits]: /docs/research/jev.md#rate-limits-context-length-and-latency
[ts-confidence-routing]: https://docs.typesafe.ai/patterns/confidence-routing
[ts-confidence]: https://docs.typesafe.ai/confidence
[ts-intent]: https://docs.typesafe.ai/patterns/intent-routing
[cb-guardrails]: https://docs.typesafe.ai/cookbooks/llm_guardrails
[cb-function-calling]: https://docs.typesafe.ai/cookbooks/function_calling
[cb-semantic-find]: https://docs.typesafe.ai/cookbooks/semantic_find
[cb-rerank]: https://docs.typesafe.ai/cookbooks/rerank_typesafe
[cb-citation]: https://docs.typesafe.ai/cookbooks/citation_check
[cb-rag]: https://docs.typesafe.ai/cookbooks/classifying_rag_passages
[cb-date]: https://docs.typesafe.ai/cookbooks/date_extraction_cookbook
[cb-parallel]: https://docs.typesafe.ai/cookbooks/parallel_questions
[cb-pre-parsed]: https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook
[ts-home]: https://typesafe.ai/
[ev-security]: https://evals.typesafe.ai/security_incidents.html
[ev-trace]: https://evals.typesafe.ai/agent_trace_observability.html
[ev-invoice]: https://evals.typesafe.ai/invoice_processing.html
[ev-support-data]: https://evals.typesafe.ai/customer_service-cases.js
[ts-jagged]: https://docs.typesafe.ai/model-jaggedness/jev-1.13
[ts-coding-agents]: https://docs.typesafe.ai/introduction/coding-agents
[pypi-sdk]: https://pypi.org/project/typesafe-sdk/
[npm-registry]: https://registry.npmjs.org/@typesafe-ai/sdk
[ts-openapi]: https://api.typesafe.ai/openapi.json
[gh-skills-10]: https://github.com/typesafe-ai/skills/issues/10
[gh-js-10]: https://github.com/typesafe-ai/typesafe-sdk-js/issues/10
[gh-py-license]: https://github.com/typesafe-ai/typesafe-sdk-python/blob/main/LICENSE
[ts-use-cases]: https://docs.typesafe.ai/concepts/use-case-map
[ts-state]: https://docs.typesafe.ai/concepts/state
[ts-api]: https://docs.typesafe.ai/api
