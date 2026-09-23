# Turn's credit alert research notes

What TypeSafe publishes about balances and billing (docs, OpenAPI spec 0.2.0,
`@typesafe-ai/sdk` 0.6.0, the MCA, and the console's public login bundles),
and what GitHub Actions, GitHub notifications, and Cloudflare offer to carry
an alert, read for issue #32 on September 23, 2026. Judgment starts with
"Synthesis:".

Contents:

1.  [TypeSafe's balance, alerts, and billing](#typesafes-balance-alerts-and-billing)
1.  [Channels that could carry the alert](#channels-that-could-carry-the-alert)
1.  [Telling low credits from the logs](#telling-low-credits-from-the-logs)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## TypeSafe's balance, alerts, and billing

The spec's two operations and the docs' silence on refills are already in the
[setup notes][setup-credits]; the MCA's credit terms are in the
[Jev notes][jev-credits].

- **No alert in the docs.** The full docs text, 910 KB on September 23, has
  no match for "low balance", "auto-refill", "auto refill", "auto-reload",
  or "auto reload". Its three "alert" matches are a use case's "alert
  histories" and "Prioritize alerts by risk" and an icon named
  `triangle-alert`; its one "notif" is a cookbook's
  `notify(ticket, team=team)` ([full docs][ts-llms-full]).
- **No cost in the response.** `SystemOneResponse` requires `model`,
  `answers`, and `usage`. `Usage` holds `input_tokens`, "Number of billable
  input tokens used to evaluate the request.", and `output_tokens`, "Output
  tokens are currently free of charge." There's no balance or cost field
  ([OpenAPI][ts-openapi]).
- **No balance header.** The SDK's code reads four response headers:
  `x-typesafe-request-id` (`index.mjs:1`), `retry-after-ms` and
  `retry-after` (`index.mjs:99-101`), and `content-type` (`index.mjs:680`).
  Its code and types have no match for "credit", "balance", or "402"; the
  two "billing" matches are a doc comment's example question
  (`index.mjs:543-545`).
- **The balance lives in the console.** "Customer may view Customer's
  current Credit balance in Customer's account." ([MCA][ts-mca])
- **The console's login bundle.** `console.typesafe.ai` redirects to
  `/login`, which loads 18 script chunks. One defines `BILLING_EVENTS`:
  "billing topup started", "billing topup succeeded", "billing topup
  failed", "billing topup unknown", "billing auto reload toggled", and
  "billing payment method attach succeeded" and "failed". No event names an
  alert, a threshold, or a notification; `SETTINGS_EVENTS` covers the
  profile, API keys, and renaming the organization. The one "Notifications"
  string is a toast list's `containerAriaLabel` ([console][ts-console]).
- **The refill threshold isn't a notice.** "if Customer's Credit balance
  reaches zero (or falls below the applicable threshold) or Customer submits
  Input through the Services after all Credits have been consumed, then (y)
  if Customer has opted in to automatic Purchased Credit refills, TypeSafe
  will automatically add to Customer's Credit balance a number of Credits
  equal to the refill dollar amount" ([MCA][ts-mca]). Auto-refill is off,
  since #79 was closed as not planned.
- **Running out is undocumented.** The docs' four "402" matches are two
  `# noqa: E402` comments and a Wikipedia revision ID, and "Payment
  Required" never appears ([full docs][ts-llms-full]); the spec lists only
  `200` and `422` ([OpenAPI][ts-openapi]). The SDK passes a 402 as the base
  `APIError` ([relay notes][relay-errors]), and the relay logs it as
  `credits` (`worker/src/device.ts:58`). The body TypeSafe would send is
  unknown.
- **Price.** Unchanged since the [Jev notes][jev-prices]: `jev-1.13.0`
  costs "$42 / $0.042" per Btok and per Mtok. "Charged per input token.
  Output tokens are free." ([Models][ts-models]) Per model: "The rate at
  which Credits are consumed may vary based on account settings, including
  the model used by Customer to generate Output, as may be indicated to
  Customer on the Services." ([MCA][ts-mca])
- Synthesis: TypeSafe publishes no low-balance alert, no balance or usage
  endpoint, and no balance in a response's body or headers; the balance
  shows only in the signed-in console, and the login bundle knows top-ups
  and auto reload but nothing like an alert. The alert has to come from the
  relay's logs, measured against a balance a person reads in the console.

[setup-credits]: /docs/research/0036-turn-setup.md#typesafes-api-and-credits
[jev-credits]: /docs/research/0005-jev.md#free-tier-credits-and-programs
[jev-prices]: /docs/research/0005-jev.md#jev-prices
[relay-errors]: /docs/research/0038-turn-relay.md#the-sdks-errors-fetch-and-runtime
[ts-llms-full]: https://docs.typesafe.ai/llms-full.txt
[ts-console]: https://console.typesafe.ai/login

## Channels that could carry the alert

- **Schedule syntax.** "Use POSIX cron syntax to schedule workflows to run
  at specific times. By default, scheduled workflows run in UTC. You can
  optionally specify a timezone using an IANA timezone string for
  timezone-aware scheduling." "The shortest interval you can run scheduled
  workflows is once every 5 minutes." ([events][gh-events])
- **Delays and drops.** "The `schedule` event can be delayed during periods
  of high loads of GitHub Actions workflow runs. High load times include
  the start of every hour. If the load is sufficiently high enough, some
  queued jobs may be dropped." "Scheduled workflows will only run on the
  default branch." ([events][gh-events])
- **The 60-day rule names public repositories.** "In a public repository,
  scheduled workflows are automatically disabled when no repository
  activity has occurred in 60 days." ([events][gh-events])
- **A failed run.** "Notifications for scheduled workflows are sent to the
  user who last modified the cron syntax in the workflow file."
  ([events][gh-events])
- **Minutes.** GitHub Free for organizations includes 2,000 minutes a month
  and 500 MB of artifact storage for private repositories. "At the start of
  each month, the minutes used by the account are reset to zero." "If your
  account does not have a valid payment method on file, usage is blocked
  once you use up your quota." Linux 2-core (x64), `actions_linux`, costs
  $0.006 a minute ([Actions billing][gh-billing]).
- **Opening an issue.** GitHub's "Schedule issue creation" tutorial runs
  `gh issue create` with `--title`, `--assignee`, `--label`, and `--body`
  in a job with `permissions: issues: write` and
  `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` ([tutorial][gh-sched]). "Create
  an issue" needs "Issues" repository permissions (write), and "This
  endpoint triggers notifications." ([REST issues][gh-rest])
- **Token defaults.** The `GITHUB_TOKEN`'s permissions "are initially set to
  the default setting for the enterprise, organization, or repository"; "If
  you specify the access for any of these permissions, all of those that
  are not specified are set to `none`." ([workflow syntax][gh-syntax])
- **Who hears.** "you are automatically subscribed to conversations by
  default when you have: Not disabled automatic watching for repositories
  or teams you've joined in your notification settings. This setting is
  enabled by default. Been assigned to an issue or pull request. Opened a
  pull request or issue. Commented on a thread. [...] Had your username
  @mentioned. [...] Had a team you're a member of @mentioned." Delivery is
  "through the notifications inbox at https://github.com/notifications and
  in the GitHub Mobile app, through your email, or some combination of
  these options." ([About notifications][gh-notif])
- **Cloudflare Notifications.** The available-notifications page has no
  entry for Workers, Durable Objects, or Workers Logs. Its logs alert,
  "Failing Logpush Job Disabled", is for "Enterprise customers who use
  Logpush"; "Usage Based Billing" is "Included with Professional plans or
  higher. Note: Usage-based billing notifications are available to
  Pay-as-you-go accounts only." ([Notifications][cf-notif])
- **Cron Triggers.** UTC, 5 per account on Free, and 10 ms of CPU on Free,
  as the [Workers notes][cf-cron-note] record.
- **Email from a Worker.** The `send_email` binding now belongs to
  Cloudflare Email Service. "Before you onboard a sending domain, you can
  send emails only to verified destination addresses in your account."
  "Sends to verified destination addresses are always free: they do not
  count toward your monthly quota or your daily sending limits, on any
  plan, including when only Email Routing is configured. You can only send
  from your routing domains." ([Email Service limits][cf-email-limits]) Its
  errors include `E_SENDER_NOT_VERIFIED` and `E_RECIPIENT_NOT_ALLOWED`,
  "Recipient address not in `allowed_destination_addresses`"
  ([Workers API][cf-send]).
- Synthesis: a scheduled workflow in the private repo that opens an issue,
  assigning or @mentioning the receivers, reaches them by GitHub's defaults
  at no cost: a daily run of about a minute uses some 30 of 2,000 minutes
  a month. It needs `permissions: issues: write`, a schedule off the hour,
  and a check that tolerates a late or dropped run. Cloudflare
  Notifications offers nothing for Workers on Free. Email from the Worker
  needs a domain with Email Routing on the account and verified receivers,
  so GitHub is the cheaper channel for a team that already works in issues.

[gh-events]: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
[gh-billing]: https://docs.github.com/en/billing/concepts/product-billing/github-actions
[gh-sched]: https://docs.github.com/en/actions/tutorials/manage-your-work/schedule-issue-creation
[gh-rest]: https://docs.github.com/en/rest/issues/issues
[gh-syntax]: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
[gh-notif]: https://docs.github.com/en/subscriptions-and-notifications/concepts/about-notifications
[cf-notif]: https://developers.cloudflare.com/notifications/notification-available/
[cf-cron-note]: /docs/research/0010-cloudflare-workers.md#cron-triggers
[cf-email-limits]: https://developers.cloudflare.com/email-routing/limits/
[cf-send]: https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/

## Telling low credits from the logs

- **What the relay logs.** An answered line's object carries `model` and
  `inputTokens`, taken from `result.usage.input_tokens`
  (`worker/src/device.ts:52`), and a 402 becomes outcome `credits`
  (`device.ts:58`), as the [TRD][trd-logs] lays out.
- **Billed per input token.** Credits "are consumed by each Input submitted
  to the Services" ([MCA][ts-mca]); `input_tokens` are the "billable input
  tokens" ([OpenAPI][ts-openapi]); the price is "Charged per input token"
  with no per-call fee named ([Models][ts-models]).
- **By model.** The rate "may vary based on account settings, including the
  model used" ([MCA][ts-mca]); the models page prices only `jev-1.13.0`
  ([Models][ts-models]).
- **No balance to read.** No endpoint returns one ([OpenAPI][ts-openapi]),
  so a script starts from a balance a person reads in the console.
- **Three days of logs.** The Free plan keeps Workers Logs for 3 days
  ([relay notes][relay-logs]).
- Synthesis: spend is the sum of logged `inputTokens` for `jev-1.13.0`
  times $0.042 per million, so $1 of credit covers about 23.8 million
  input tokens. A script can subtract each day's spend from the last
  balance read in the console, alert when the rest falls under a level,
  and must run at least every 3 days and carry the sum forward, for example
  in the issue's comments. A logged `model` other than `jev-1.13.0` breaks
  the rate. The first `credits` outcome is the backstop, not a warning: the
  balance is already gone.

[trd-logs]: /docs/TRD.md#logs-and-counts
[relay-logs]: /docs/research/0038-turn-relay.md#workers-logs

## Gaps

- **A 402's body.** Nothing was called with a key, so whether TypeSafe
  answers an empty balance with 402, and with what body, is unconfirmed.
- **The signed-in console.** Only the login page's chunks were read; a
  billing page might offer a low-balance email. Look in the console by eye.
- **Emails from TypeSafe.** No page read says whether TypeSafe emails an
  account at a low or zero balance.
- **Reading logs from a workflow.** Querying Workers Logs from outside the
  dashboard, and the Cloudflare API token permission it needs, weren't
  researched.
- **GitHub's default delivery.** "About notifications" doesn't say whether
  email is on by default; the notification settings page wasn't read.
- **The organization's settings.** Whether Actions are allowed and what the
  `GITHUB_TOKEN` default is can't be seen without signing in.
- **Email Service quotas.** The daily numbers and whether the account has
  a domain with Email Routing weren't checked.

## See also

- [Jev notes, free tier, credits, and programs](/docs/research/0005-jev.md#free-tier-credits-and-programs)
- [Setup notes, TypeSafe's API and credits](/docs/research/0036-turn-setup.md#typesafes-api-and-credits)
- [Relay notes, the SDK's errors](/docs/research/0038-turn-relay.md#the-sdks-errors-fetch-and-runtime)
- [Relay notes, Workers Logs](/docs/research/0038-turn-relay.md#workers-logs)
- [Workers notes, Cron Triggers](/docs/research/0010-cloudflare-workers.md#cron-triggers)
- [TRD, Failure modes](/docs/TRD.md#failure-modes)
- [TRD, Logs and counts](/docs/TRD.md#logs-and-counts)

[ts-openapi]: https://api.typesafe.ai/openapi.json
[ts-models]: https://docs.typesafe.ai/models
[ts-mca]: https://typesafe.ai/legal/mca
