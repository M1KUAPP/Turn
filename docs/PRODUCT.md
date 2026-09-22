# Turn product

Turn is an augmentative and alternative communication (AAC) app for iPhone,
for adults who can't rely on speech. It speaks the user's saved phrases and
typed words, and in Listen mode it hears what a partner says and offers
replies in the user's own saved words, with Jev deciding which of them answer.
This document says what Turn is, who it's for, the principles behind its
decisions, and where it goes after the first version. The
[idea](/docs/IDEA.md) records why the team chose it for the Next Gen Award,
the [product requirements](/docs/PRD.md) say what the first version must do,
and the [technical requirements](/docs/TRD.md) say how it's built. Facts are
as of September 22, 2026.

Contents:

1.  [Turn in brief](#turn-in-brief)
1.  [Vision](#vision)
1.  [Users and partners](#users-and-partners)
1.  [See also](#see-also)

## Turn in brief

- **What:** a speaking grid of the user's saved phrases and a keyboard, both
  spoken aloud in the user's Personal Voice or a system voice, plus Listen
  mode: when a partner finishes speaking, a row of big buttons above the grid
  offers the user's own phrases that answer what was said. Nothing speaks
  until the user taps.
- **For whom:** adults who can read and tap but can't rely on their speech,
  such as people living with ALS or recovering from a stroke, and the people
  they talk with; see [Users and partners](#users-and-partners).
- **How it earns:** speaking is free. Turn Listen, a one-time purchase of
  $24.99, keeps Listen mode on after 20 free partner lines.
- **Where:** iPhone, in US English, built with Expo. For the Next Gen entry,
  it runs as debug builds and a Simulator build from a public repository,
  with no store release, as the [Next Gen rules][ng-submit] allow.
- **What Jev decides:** for each partner line, which of 40 of the user's
  phrases answer it, and whether any do. Jev never writes a word; see
  [how Jev fits][idea-jev].
- **Status:** the first version is filmed on Monday, September 28, and
  submitted by Wednesday, September 30, 2026, on the idea's
  [schedule][idea-schedule].

[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[idea-jev]: /docs/IDEA.md#how-jev-fits
[idea-schedule]: /docs/IDEA.md#schedule-to-september-30

## Vision

Turn wants people who can't rely on speech to take their turn in a
conversation before it moves on, saying what they would have said, in words
they chose. Its line: "Your own words, in time for your turn."

That aim sets three tests for every decision:

- **In time.** The reply should be waiting when the partner finishes, before
  the user reaches for the keyboard. Aided communication runs at "8–10 wpm"
  against speech at 125 to 185 words a minute, and by the time a reply is
  typed, the conversation has moved on ([problem][idea-problem]).
- **In their own words.** Everything Turn says, the user wrote or chose to
  keep. Turn ranks the user's phrases; it never writes new ones.
- **On their terms.** Nothing speaks until the user taps, listening happens
  only with consent and in plain view, and speaking never costs money.

## Users and partners

These profiles are synthesis from the idea's
[evidence on the problem and audience][idea-problem] and the
[AAC practice notes][aac-notes]; nobody who uses AAC has been interviewed
yet.

- **The person who speaks with Turn** is an adult who can read, spell, and
  touch a screen, but whose speech isn't reliable: someone living with ALS
  whose speech is slowing, someone with dysarthria after a stroke, or
  someone after a laryngectomy, and many adults with multiple sclerosis,
  Parkinson's disease, or cerebral palsy. They want to answer in time, in
  their own words, without looking as if the phone talks for them. Turn
  gives them a row of their own replies as the partner finishes, and the
  grid and keyboard for everything else. People with ALS often move from
  touch to switches or eye gaze, so Turn has to keep working with iOS's own
  Switch Control and Eye Tracking.
- **The partner** is whoever they talk with: a spouse, a friend, a nurse, a
  shop worker. They want to know when the phone is listening and where their
  words go, and to be able to say no. Turn shows them a consent card each
  time listening starts, and a light while it listens.
- **The person who sets it up** is often a family member or caregiver, who
  adds names, places, and phrases, and may buy Turn Listen. Turn gives them a
  phrase bank editor, and Restore Purchases in Settings.
- **The clinician** is a speech-language pathologist who recommends AAC
  tools and may review Turn. They want to see that it is safe when it's
  wrong and honest about what it does. Turn gives them fixed Yes, No, and Not
  sure buttons, a row that holds when nothing fits, and a published
  evaluation.

Turn isn't built, in its first version, for:

- **People whose language itself is affected,** as in many kinds of aphasia,
  for whom rows of written phrases may not fit ([AAC notes][aac-notes]).
- **Children.** TypeSafe says its services aren't "directed to children", so
  Turn is for adults, and a switch keeps a partner under 18 from reaching Jev
  ([ages and accounts][ng-minors]).
- **People who need switch or eye-gaze access beyond what iOS provides.**
  Turn works with iOS's own Switch Control, Voice Control, and eye and head
  tracking, but its first version adds none of its own.
- **Emergencies.** Turn is not an emergency service.

[ng-minors]: /docs/research/next-gen.md#minors-ages-and-accounts

## See also

- [Idea](/docs/IDEA.md): why Turn was chosen for the Next Gen Award, its
  schedule, risks, and pitch.
- [Product requirements](/docs/PRD.md): what the first version must do, as
  numbered requirements with checks.
- [Technical requirements](/docs/TRD.md): how the first version is built.
- [AAC practice notes][aac-notes]: design conventions, access, outcome
  measures, and ethics in AAC.
- [Evidence notes](/docs/research/next-gen-evidence.md): rivals, need, and
  harm behind the idea.
- [Jev notes](/docs/research/jev.md): what Jev is, its API, prices, limits,
  and terms.
- [Guessling product](/docs/archive/guessling-product.md): the product
  document for the team's first idea, archived.

[idea-problem]: /docs/IDEA.md#problem-and-audience
[aac-notes]: /docs/research/aac-practice.md
