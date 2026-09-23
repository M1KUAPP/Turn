# Turn's relay

The Cloudflare Worker that answers Turn's partner lines with Jev's scores.
It counts each user's 20 free lines, checks `listen` with RevenueCat past
them, and writes one log line per request with no text. The TRD's
[Relay API](/docs/TRD.md#relay-api) describes its requests, and
[Logs and counts](/docs/TRD.md#logs-and-counts) its log line.

Contents:

1.  [Daily counts from the logs](#daily-counts-from-the-logs)
1.  [See also](#see-also)

## Daily counts from the logs

`bun run logs` prints a UTC day of the relay's log lines, as METRIC-2 asks:
lines answered, paywall responses, failures, every other outcome, the
latency of answered lines at the median and the 95th percentile, and Jev's
input tokens. Workers Logs keep 3 days on the Free plan, so run it once a
day through judging, October 1 to 13, 2026.

```shell
cd worker
bun run logs                  # yesterday, in UTC
bun run logs --day 2026-09-23 # any of the last 3 days; today runs to now
```

It reads two variables from the shell, never the command line:

- **`TURN_CF_LOGS_TOKEN`:** a Cloudflare API token that can query Workers
  Logs. In the dashboard, go to My Profile, API Tokens, Create Token, and
  Create Custom Token. Give it the account permission Workers Observability
  at Edit, which the API calls "Workers Observability Write", for the Turn
  account only.
- **`TURN_CF_ACCOUNT_ID`:** the Turn account's ID, from the dashboard.

Neither is one of Wrangler's names, so setting them changes nothing Wrangler
deploys with. What the counts mean:

- **Failures** are lines that got no answer because something broke:
  `failed` and `credits` when Jev failed or ran out of credits,
  `unverified` when RevenueCat's check failed with no cached yes, and
  `internal`.
- **Other outcomes** are the configuration (`config`), lines refused before
  any call (`invalid`, `duplicate`), lines while Jev is off (`off`), and
  anything else the relay logs.
- **Latency** is over answered lines only, in all and in Jev, taken by
  nearest rank: the smallest time with at least half, or 95%, of the lines
  at or below it.
- **The first line** gives the log lines read beside the events the query
  matched. More events than lines means some payloads weren't the relay's
  log lines, such as a runtime error.

A day looks like this:

```text
The relay's logs for 2026-09-23, in UTC: 57 log lines, of 57 events the query matched

Lines answered: 42
Paywall responses: 3
Failures: 2 (failed 1, unverified 1)
Other outcomes: config 8, duplicate 1, invalid 1

Latency of answered lines, in milliseconds:
- In all: median 812, 95th percentile 1480
- In Jev: median 640, 95th percentile 1302

Jev's input tokens: 21504
```

## See also

- [Relay logs notes](/docs/research/0040-turn-relay-logs.md)
- [The plan for free lines, logs, and the alert](/docs/plans/0018-turn-paywall-logs-alert.md)
