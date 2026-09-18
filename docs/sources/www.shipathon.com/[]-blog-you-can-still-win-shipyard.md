---
url: "https://www.shipaton.com/blog/you-can-still-win-shipyard"
title: "You can still win Shipyard — multiply your changes by shipping to another brief | Shipaton 2026"
---

# You can still win Shipyard — multiply your changes by shipping to another brief

*By Perttu Lähteenlahti · Feb 6, 2026 · 6 min read*

Less than a week left to Shipyard? You’re not too late. Explore practical app
ideas for three creator briefs, learn how AI tooling speeds up development, and
see how to ship a competitive MVP before the deadline.

Contents:

1.  [Make use of the vibecoding tools included in the shipping container](#make-use-of-the-vibecoding-tools-included-in-the-shipping-container)
1.  [Briefs that you could target](#briefs-that-you-could-target)
    1.  [“investment tracker for all assets” —— josh from visualfaktory](#investment-tracker-for-all-assets-josh-from-visualfaktory)
    1.  [“powerful reminders with cross-device sync.” –– sam beckman](#powerful-reminders-with-cross-device-sync-sam-beckman)
    1.  [“social app for van-lifers on the road” —— quin gable](#social-app-for-van-lifers-on-the-road-quin-gable)
1.  [Wrap up](#wrap-up)

There are less than six days left to submit your final entry to Shipyard, and if
you’re thinking you’re already too late, I have just one word for you: wrong.

Even if you haven’t started building yet, there’s still enough time to get an
app to beta and ship it through TestFlight or Google Play’s testing tracks.
Shipyard isn’t about perfection, it’s about shipping — and a focused MVP can
absolutely be competitive at this stage. And if you already have one app ready
to submit, this is your chance to multiply your odds by building and submitting
another app for a different brief.

In this post, we’ll walk through a few of the creator briefs and explore
concrete ideas for how you could realistically ship an app for each of them. The
goal is to help you move from “maybe” to “shipped,” even if you’re starting late
or considering a second (or third) submission.

## Make use of the vibecoding tools included in the shipping container

Anthropic recently released a new version of their Claude Code Opus 4.6 model,
and it’s already supported by the tools included in the Shipping Container. That
means you’re not just reading about more powerful AI-assisted coding, you can
actually use it right now, as part of Shipyard, without any extra setup.

With these tools, building an app is no longer about writing everything from
scratch or spending weeks on boilerplate. You can scaffold features, iterate on
UI, and explore ideas at a pace that simply wasn’t possible before. Shipyard is
a perfect excuse to take these tools for a real-world test drive and see how far
you can get in a single weekend with focused execution.

## Briefs that you could target

Shipyard offers seven different creator briefs for you to choose from, and
you’re allowed to submit one app for each brief. That gives you a lot of
flexibility — but it also comes with a few important constraints. You can’t
submit multiple apps to the same brief, and you can’t submit a single app to
multiple briefs. Each submission needs to clearly map to one brief, so it’s
worth being deliberate about which problems you decide to tackle.

With just about a week left to build, it’s easy to assume that the window has
already closed — but that’s not the case. To show what’s still possible, we’ve
picked a few very different briefs and explored how you might realistically
approach each of them in a short time frame. The goal isn’t to overwhelm you
with ideas, but to help you see how a focused MVP can still be competitive.

Whether you’re only now jumping into Shipyard, or you already have one app
submitted and are considering building a second — or even a third — these
examples should give you a clearer sense of how to scope your work, pick the
right brief, and maximize your chances of shipping something meaningful before
the deadline.

### “investment tracker for all assets” —— josh from visualfaktory

_Investors juggle stocks, gold, funds, fixed income, real estate, and more
across multiple platforms — messy to track and hard to understand at a glance.
Josh wants a single app where users can_ _**log everything**_\*, get\*
_**real-time price updates**_ _where possible, set_ _**amortization/reminder
alerts**_ _for non-listed products, and unlock_ _**premium risk +
diversification analysis**_ _(like country/sector exposure)._

This brief can seem intimidating at first. Supporting many different asset types
sounds complex, but it’s exactly the kind of problem modern LLMs excel at:
turning messy, unstructured information into clean, usable data.

A strong approach is to lean on the APIs from OpenAI, Anthropic, or Google and
build an app that accepts almost any input — spreadsheets, screenshots, PDFs, or
dictated descriptions — and converts them into structured assets your app can
work with. The key is designing prompts that normalize the data and then
visualizing it clearly. You can also use AI to analyze the portfolio and
generate insights, pulling in real-time finance data when needed.

On the business side, this works naturally with usage based pricing. Using
RevenueCat’s virtual currencies, you could offer AI-assisted imports and
advanced risk analysis as credit based features, tying monetization directly to
value delivered.

### “powerful reminders with cross-device sync.” –– sam beckman

_Sam lives by reminders, but switching between Android and iOS means rebuilding
his entire system from scratch. He wants a beautiful, fully functional reminders
app on both iOS + Android\* with custom snoozes from notifications, powerful
recurring rules, and true sync so dismissing once clears everywhere._

_\*For the purpose of the hackathon, you only need to build an MVP for iOS or
Android_

This brief is fundamentally about cross-platform thinking. Frameworks like
Flutter, Kotlin Multiplatform, and React Native are a natural fit here — and if
you’re building with React Native, you’re in especially good shape. Tools like
Rork, Blink, Fastshot, Vibecode, and Replit make it surprisingly easy to
scaffold and ship polished React Native apps quickly.

The app itself is once again the easy part. The real challenge — and the real
opportunity — lies in reminders and notifications. Doing this well requires
reliable sync and state management across devices, which usually means running
your own backend. Instead of building everything from scratch, you can lean on
tools like Firebase or Supabase to get a real-time database, auth, and sync set
up quickly, without spending your limited hackathon time on infrastructure.
Supabase especially, has a really good MCP, which you can make use by telling
your AI agent to set up everything there

With a focused MVP, even a single-platform reminder app with rock-solid
notifications and sync can stand out. Especially if it’s beautifully designed
and clearly solves a problem Sam’s audience deeply cares about.

### “social app for van-lifers on the road” —— quin gable

_Dating and making friends on the road is hard when you’re always moving—and van
life is a tight, protective community. Quin wants a van-life app with_
_**nomadic dating**_\\*,\\* _**activity-based friend finding**_\*, and even a
paid ‘\* _**builder help’ section**_ _for van projects, with_ _**invite-only or
verified**_ _access to keep it safe and intentional._

This brief gives you a chance to flex skills you don’t often get to use:
building a social network from scratch. The surface level requirements are
fairly simple, but making this work will still require a backend for accounts,
messaging, and locationaware discovery. For tooling and infrastructure, it’s
worth revisiting the previous brief for suggestions on how to get this set up
quickly.

Where this brief really stands or falls is differentiation. To stand out, you
need a clear hook that immediately resonates with van-lifers. One approach could
be building a kind of mobile friendship book, where you collect connections as
you travel from place to place. Layer in location based discovery and messaging,
and you already have a well scoped app that feels built for this community.

## Wrap up

Hopefully this post sparked a few ideas, whether that means submitting your very
first app to Shipyard, or doubling down with a second one. If you’re still
feeling stuck on what to build, how to scope it, or how to turn your work into a
compelling story, I’d recommend checking out another post I wrote for exactly
that situation, modestly titled
[How to win Shipyard](https://www.revenuecat.com/blog/engineering/how-to-win-shipyard/)
.

With only a few days left before Devpost submissions close, it’s also worth
revisiting the mechanics of a strong submission. I’ve covered that in a separate
post,
[How to submit your app for Shipyard](https://www.revenuecat.com/blog/engineering/how-to-submit-your-app-for-shipyard/)
, where I break down what you actually need: a working app, a clear description,
and a short three minute video showcasing what you built. That video matters
more than most people expect, so make sure you spend some time getting it right.

Now get hacking.
