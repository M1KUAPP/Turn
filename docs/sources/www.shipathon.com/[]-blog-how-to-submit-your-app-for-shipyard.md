---
url: "https://www.shipaton.com/blog/how-to-submit-your-app-for-shipyard"
title: "How to submit your app for Shipyard | Shipaton 2026"
---

# How to submit your app for Shipyard

*By Perttu Lähteenlahti · Jan 30, 2026 · 6 min read*

Learn how to submit your iOS or Android app to Shipyard, including TestFlight
and Google Play testing requirements, RevenueCat integration, demo video rules,
and judging criteria.

Contents:

1.  [Shipyard rule recap](#shipyard-rule-recap)
    1.  [What can you build your app with?](#what-can-you-build-your-app-with)
    1.  [Your app must have RevenueCat integrated](#your-app-must-have-revenuecat-integrated)
    1.  [Apps must be on testflight (iOS) or a Google Play testing track (Android)](#apps-must-be-on-testflight-ios-or-a-google-play-testing-track-android)
    1.  [You can publish your app (but it’s optional)](#you-can-publish-your-app-but-its-optional)
1.  [How to submit your app to Shipyard](#how-to-submit-your-app-to-shipyard)
1.  [App testing and RevenueCat verification](#app-testing-and-revenuecat-verification)
    1.  [How to submit your iOS app](#how-to-submit-your-ios-app)
    1.  [How to submit your Android app](#how-to-submit-your-android-app)
1.  [Summary](#summary)

Submitting your app to Shipyard should be straightforward, as you don’t need to
navigate app store reviews or production release requirements to participate.
What matters is that judges can install and evaluate your app reliably during
the hackathon.

This article explains exactly what is required, what is optional, and how to
submit your app correctly.

## Shipyard rule recap

Before you submit your app, make sure your app adheres to the rules of Shipyard:

- Mobile apps only — iOS, Android, or cross-platform (no web/desktop apps)
- All projects must be started and completed within the hackathon timeframe
- Participants can only submit one app for one brief — choose wisely!
- RevenueCat integration is mandatory — subscriptions or in-app purchases
- Apps must be on TestFlight (iOS) or Play Internal Testing (Android) — you can
  have the app live on app stores, but this isn’t required
- Developers retain full ownership of all intellectual property
- If you use an influencer’s name or likeness, you must remove it before public
  launch (unless agreed with the influencer)
- Any post-hackathon collaboration with influencers is separate from RevenueCat

Let’s take a closer look at a few key rules next.

### What can you build your app with?

The main goal of Shipyard: Creator Contest is to build an MVP of a mobile app
for the selected creators’ audience. You can use any technology (Swift, Kotlin,
Flutter, React Native, etc.) or tool (Cursor, Xcode, Claude, Vibecode, Rork,
etc.), as long as it produces a mobile app that can be uploaded to either Apple
App Store or Google Play Store. This means that web apps are out of the scope of
this hackathon. Tools such as Capacitor are allowed, in case you’re turning a
web app into a native mobile app.

### Your app must have RevenueCat integrated

Your app must have a version of the RevenueCat SDK installed on it, and you must
have your in-app purchases configured for the platforms your app is targeting,
and the in-app purchase products need to be purchasable. Test store
configuration **is not counted** as an integrated SDK.

Full configuration of RevenueCat requires you to have either an Apple Developer
account or Google Play developer account.

- Your app must have RevenueCat SDK integrated
- App must have subscriptions and/or in-app purchases
- Test store integration is not enough

### Apps must be on testflight (iOS) or a Google Play testing track (Android)

Your app must be distributable through either TestFlight in App Store Connect,
for iOS apps; or Google Play Public/Closed/Internal testing track, for Android
apps. This means that you need to have an account on at least one of those
stores for the app you’re submitting. Sadly RevenueCat is unable to cover the
cost of the developer account for participants.

For TestFlight distribution, at least one app has to have been submitted to App
Store Connect, and made available for distribution on the TestFlight tab. The
app you submit to Shipyard should have **External testing** enabled, with a
public link. Attach the public link to your Devpost submission.

For Google Play Console testing tracks, your app has to be uploaded to Google
Play Console and made available through an Internal, Closed, or Public testing
track so judges can install and evaluate it.

### You can publish your app (but it’s optional)

Making your app public and publishing for people to download from the App Store
and Google Play Store is allowed during and after the hackathon. Doing this will
not affect judging, but you’re also not required to wait on publishing your app.

- Publishing during Shipyard is allowed
- Publishing does not disqualify your app
- Publishing does not affect judging

## How to submit your app to Shipyard

Your app needs to be testable on either iOS or Android devices, with
distribution done either through
[TestFlight for iOS](https://developer.apple.com/testflight/) , or one of Google
Play Console testing tracks for Android.

## App testing and RevenueCat verification

Due to the number of submissions, we do not guarantee that every app will be
fully installed and tested by judges. The required demo video is the primary way
judges will be viewing _all_ apps, before shortlisted apps will be viewed in
more detail.

However, all winning apps will be installed and tested to verify correct
integration of the RevenueCat SDK and confirm that subscriptions and/or in-app
purchases are implemented as described. If a winning app cannot be installed or
does not have a working RevenueCat integration, it may be disqualified and the
award reassigned.

To avoid issues, make sure your submitted build is installable, stable, and
matches what is shown in your demo video.

### How to submit your iOS app

First, upload at least one build of your app to App Store Connect using Xcode.
Once the build is processed, go to the TestFlight tab and enable External
Testing. Create a public TestFlight link so anyone with the link can install the
app without being added manually.

Make sure the build you share is stable, launches correctly, and allows judges
to reach the core functionality of your app. If your app includes subscriptions
or in-app purchases, they must be purchasable, meaning that you’ve integrated
RevenueCat with App Store connect.

Finally, copy the public TestFlight link and include it in your Shipyard
(Devpost) submission. Judges will use this link to install and evaluate your
app.

### How to submit your Android app

To submit an Android app to Shipyard, your app must be installable by judges
through one of Google Play’s testing tracks.

**Internal testing**

Upload your app to the **Google Play Console** and create an **Internal
testing** track. Add
**[shipyard-android@revenuecat.com](mailto:shipyard-android@revenuecat.com)** as
a tester email so judges can access the app. Once the build is approved for
internal testing, verify that the app installs correctly and that all core
functionality is accessible.

If your app includes subscriptions or in-app purchases, they must be
purchasable, meaning that you’ve integrated RevenueCat with Google Play Console.

**Closed testing**

Alternatively, you can use a **Closed testing** track. Upload your build to the
closed track and add
**[shipyard-android@revenuecat.com](mailto:shipyard-android@revenuecat.com)** to
the tester list (either directly by email or via a Google Group that includes
this address). Make sure access is granted before submitting.

Confirm that the app installs cleanly and that judges can reach the main
features without additional setup.

**Public testing**

You may also use **Public testing**. Upload your app to a public testing track
and ensure the app is available for anyone to install without requiring
approval. Share a link to your public testing version in the Devpost submission.

## Summary

Shipyard does not require you to launch your app publicly, but it does require
that judges can reliably install and test it. As long as your app is available
through TestFlight (iOS) or a Google Play testing track (Android) and includes a
working RevenueCat integration, you’re good to submit.

Publishing your app to the App Store or Google Play during or after the
hackathon is optional and does not affect judging. Focus on shipping a solid,
testable MVP. If judges can install your app and experience its core
functionality, you’ve met the submission requirements.

If anything is unclear, [ask in Discord](https://discord.gg/shipaton26) . We’re
happy to help you get unstuck quickly. Happy shipping!
