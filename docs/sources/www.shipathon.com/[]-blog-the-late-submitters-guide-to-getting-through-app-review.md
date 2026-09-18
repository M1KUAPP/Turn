---
url: "https://www.shipaton.com/blog/the-late-submitters-guide-to-getting-through-app-review"
title: "The late submitter's guide to getting through app review | Shipaton 2026"
---

# The late submitter's guide to getting through app review

*By Perttu Lähteenlahti · Sep 3, 2026 · 10 min read*

Everything you need to get your app approved by App Store review and Play Store
review before the Shipaton deadline

Contents:

    1.  [How much time do you actually have?](#how-much-time-do-you-actually-have)
    1.  [How does the app review process work?](#how-does-the-app-review-process-work)
1.  [I have not yet submitted my app for review](#i-have-not-yet-submitted-my-app-for-review)
    1.  [Should you ship your first version without in-app purchases?](#should-you-ship-your-first-version-without-in-app-purchases)
    1.  [Ace google’s 14-day testing requirement](#ace-googles-14-day-testing-requirement)
    1.  [Make use of testflight and testing tracks](#make-use-of-testflight-and-testing-tracks)
    1.  [Get all your assets ready](#get-all-your-assets-ready)
1.  [I’m ready to submit // i’ve already submitted my app](#im-ready-to-submit-ive-already-submitted-my-app)
    1.  [Go through your submission](#go-through-your-submission)
    1.  [Figure out your auth](#figure-out-your-auth)
    1.  [Record a video of your app in use](#record-a-video-of-your-app-in-use)
    1.  [Use the expedited review process (for bugs)](#use-the-expedited-review-process-for-bugs)
1.  [What your next 30 days should look like](#what-your-next-30-days-should-look-like)

At the time of writing, there’s a little less than a month left before the
Shipaton deadline. Following conversations in our Discord and on social media,
we’ve noticed three groups of developers: some have been stuck in app review
despite submitting early; some haven’t submitted yet and are worried they won’t
make it; and some are only just starting to build and are considering giving up
because they’ve heard reviews can take a long time.

So I decided to write this guide to help you get through app review as quickly
as possible. Apple and Google can be unpredictable, but the process is mostly
manageable if you do the right things. Even if there’s less than a month left
when you read this, don’t give up: mobile apps can ship surprisingly fast. Your
app must be publicly available — not just in TestFlight or a Google Play testing
track — before submissions close, so review should be your priority. This guide
will show you how to reduce your app to a review-ready release, navigate Google
Play’s 14-day testing requirement, and avoid preventable delays. If you’re a
student, you can skip the stores and enter the Next Gen category with a demo
video and public open-source repository instead.

### How much time do you actually have?

[Shipaton’s submission requirements](https://www.revenuecat.com/blog/engineering/how-to-submit-your-app-for-shipaton)
say that your app must be publicly available — not just in TestFlight or a
Google Play testing track — in the US app stores by September 30th at 11:45 pm
PDT. Apple also says that it can take up to 24 hours for the app to appear in
the App Store, so to be on the safe side, your app should be in stores, with
RevenueCat powering an in-app purchase or serving ads through RevenueCat Ads, at
least a day or two before the submission period ends.

### How does the app review process work?

The next sections will assume some familiarity with the app review process both
Apple and Google have for their respective stores. Fear not, we’ll go through
the fundamentals here.

To publish your app, you need a developer account. Apple charges $99 per year,
while Google Play charges a one-time $25 registration fee. You can enroll as an
individual or an organization.

Organization accounts require additional verification, which may include a
D-U-N-S number. New personal Google Play accounts also have a testing
requirement, which we’ll cover below.

Once you have your account, you need to create your app, provide all the
required assets, and bundle your app. After that you can submit it to different
“release tracks”. In Apple’s case these release tracks are TestFlight and App
Store. The first one is meant for testing your app either in private or public
beta, and the latter is the actual store release which allows everyone to
download your app (and pay actual money for it).

Google Play offers internal, closed, open, and production tracks. You don’t have
to use every testing track. However, some new personal accounts must complete a
closed test before applying for production access. More on this below.

When we talk about submitting your app for review, we usually mean the store
release tracks. Neither Apple nor Google allow apps into their store before
someone from their team has reviewed the app, and made sure it's not misleading,
buggy, or unsafe for the users. This is the part where first-time developers
often get stuck. However, doing the right things which we go through next, you
can make this process more likely to go through without problems.

## I have not yet submitted my app for review

Ok take a deep breath, if you’re at this stage with your app, we will need to
sprint a little, because our first priority will be to get our app into the
review pipeline as soon as possible. To do this we need to strip our app to its
core features. I’ve written about how to
[build a minimum lovable product](https://www.revenuecat.com/blog/engineering/how-to-win-shipaton-part-2-building-fast)
in an earlier post, but to summarize: build something that your core users would
love, and drop everything else.

### Should you ship your first version without in-app purchases?

Comment out the draft features, remove unfinished authentication if the core
experience doesn’t need it, and postpone subscriber-only extras. You can also
consider submitting a complete free version first and adding monetization in a
second submission once the first is approved. This is optional, and it only
makes sense if you have enough time for two reviews.

Purchases and subscriptions give reviewers more to check, and missing metadata,
unclear instructions, or misconfigured products can cause a rejection. But for
the main Shipaton competition, your qualifying version must still be live before
the deadline with RevenueCat powering an in-app or web purchase, or serving ads
through RevenueCat Ads. If the deadline is close, including monetization in the
first submission may be safer than betting on a second review. Whichever route
you choose, test your purchases in the
[platform sandboxes](https://www.revenuecat.com/docs/test-and-launch/sandbox)
before submitting the monetized version.

### Ace google’s 14-day testing requirement

This requirement applies to personal Play Console accounts created after Nov 13,
2023. Before you can apply for production access, you must run a closed test
with at least 12 testers opted in continuously for 14 days.

Start with the earliest functional version of your app. You can keep building
while the closed test runs.

Once the 14 days are complete, apply for production access. Google may require
additional testing if participation or engagement is insufficient, so encourage
testers to use the app and share feedback.

To recruit testers, reach out to your friends and family. If you’re a
billionaire in Gotham City, or just someone who just doesn’t have a family, or
friends, head to our Shipaton Discord to make use of the
\#looking-for-google-play-tester channel to recruit people to give your app a
try.

My colleague Jaewoong wrote a deeper guide to
[Google Play’s 14-day testing requirement](https://www.revenuecat.com/blog/engineering/google-play-14-day/)
if you want the full walkthrough.

### Make use of testflight and testing tracks

Talking of testing, it is good to test your app with a closed or open group of
people before submitting the app to stores. This is of course a great way to
gather feedback on your product, but it is also a good way to discover the
things app review would have flagged as well: bugs, performance issues, bad
copy, and incomplete features. You save the reviewer’s time, and have a better
feedback loop in your development process.

Another thing, and this is pure speculation, but if I were an app reviewer and
would need to review 10 apps a day, I would definitely look at whether any
testing was done on the app before it was submitted for review. I would take a
TestFlight with 30 active testers as a green flag for the app, and possibly
review the app first since expectation is then that it is not pure AI slop and
my eyes are the first one to see it.

### Get all your assets ready

Apple and Google both have extensive guidance on how your store submission
should look, what assets and things you need (e.g. privacy policy and terms of
service documents), and what not to say for example (mention the word beta, or
call your unreleased app the number 1 app for doing anything). Read these
carefully, and ingest the information yourself, so that when you start editing
your screenshots and app descriptions, you know exactly what is allowed and what
is not.

For more detail, read
[Apple’s common app review issues](https://developer.apple.com/app-store/review/)
and our guide to
[common App Store rejection reasons](https://www.revenuecat.com/blog/growth/the-ultimate-guide-to-app-store-rejections)
.

## I’m ready to submit // i’ve already submitted my app

This section applies whether you're preparing to submit or your app is already
waiting for review.

Before withdrawing a submission, understand what happens. Apple removes it from
the review queue, and resubmitting starts the review process over. Apple does
not promise to review submissions in the order received.

Google is more explicit: review time is counted from your latest submitted
change. Sending additional changes while an app is under review may push it to
the back of the review queue.

Don't restart review for a minor improvement. First, check what you can edit
without withdrawing the build or whether you can provide the missing information
through the store's review communication tools.

If you discover something likely to block access or cause a rejection,
restarting may still be the faster choice. The following sections will help you
identify those issues and give reviewers the information they need.

### Go through your submission

If your submission is currently in review, it’s worth going through the
submission fields again, seeing if you’ve missed something. Common things to
check are for example if you placed placeholder links for privacy policy, or if
you forgot to put the actual content in that URL. In that case you can just go
and add the missing privacy policy. Same goes for your paywall, and the links on
it. Both Google and Apple require apps to have a privacy policy, and it needs to
match what you submitted in the privacy declaration.

For apps with subscriptions, Apple and Google require appropriate Terms of Use
links. Apple provides their own you can link to in your App Store description by
adding it in the end:Terms of Use (EULA):
[https://www.apple.com/legal/internet-services/itunes/dev/stdeula/](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/)

Privacy Policy:
[https://your-apps-privacy-policy.com](https://your-apps-privacy-policy.com/)

A common thing with both of the Terms of Service and privacy policy is that you
can get by with very simple versions if you don’t add analytics or in-app
purchases to your app. To get approved faster, consider dropping them like we
mentioned earlier, and adding them back later on.

### Figure out your auth

If your app has authentication, check that you’ve created a test account and
provided the username and password in the fields prepared for those. Reviewers
won’t create accounts, but instead expect to use an account that has already
been set up. Make sure that your test account does not have two-factor
authentication on, as that will block the reviewer. In case your test account
can’t be used without 2FA, then consider building a demo mode that shows all
parts of your app, and documenting that in the review notes.

If your app uses Google or other third-party authentication, make sure you’ve
also included Sign in with Apple, as that is a requirement. If your app uses
third-party authentication to access data that is only possible with that
account, for example you built an email client for Gmail, then document that in
the review notes as well.

If your app has subscriptions, make sure that your test account does not have an
active entitlement, otherwise the test account might not see your paywall, which
in turn blocks the reviewer from reviewing your paywall and in-app purchases.

### Record a video of your app in use

There’s been an uptick in Apple asking people to record a video of their app in
use, showcasing for example the in-app purchases and authentication parts. This
can be a simple screen recording, under a minute in length, that just showcases
how your app functions and what happens for example after purchasing a
subscription. Don’t overthink it, and consider adding it before reviewers even
ask for it.

### Use the expedited review process (for bugs)

This final point is something we advise against. Apple allows you to request an
expedited review if you face “extenuating circumstances.” In practice, this
means fixing a critical bug that severely affects the app experience or
coordinating a release with an event you’re directly associated with.

You might think that releasing your app for Shipaton is one of these events
where you can use the expedited review process to get your app approved in time,
especially since Shipaton is a time-sensitive event, and you are directly
associated with the event as a registered participant.

However, Apple does not explicitly say that hackathon or competition timelines
qualify. Apple also decides each request individually. RevenueCat’s official
guidance is not to use expedited review for this. Instead, focus on submitting
your app early enough and following the tips above.

## What your next 30 days should look like

The points we’ve gone through in this article are not a magic bullet for acing
app store reviews, but following them multiplies your chances for having a
compliant app, the necessary requirement for passing the store review.

In terms of timeline, you should focus on getting your app in review in the next
two weeks, and preferably in the next week. Stop developing new features.
Instead, focus on fixing launch-blocking bugs and getting your app to an MVP
stage you can submit for review. Once the app is approved by Apple or Google,
the review process tends to go faster, so you will have higher chances of
getting for example a version with in-app purchases approved.
