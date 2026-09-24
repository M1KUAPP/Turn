export type NoticeSection = { title: string; body: string }

function notice(service: string): NoticeSection[] {
  return [
    {
      title: 'What stays on this iPhone',
      body: 'Your phrase bank, places, tap counts, and settings stay on this iPhone until you erase them. Audio is never recorded, stored, or sent. A partner’s transcript is held in memory as a caption for at most two minutes, then forgotten. Turn keeps no transcript history.'
    },
    {
      title: 'What leaves in Listen mode',
      body: `After you and your partner agree, Turn transcribes their speech on the iPhone. For each partner line, Turn sends the text, the current place name, category names, and up to 40 candidate phrases through a relay on Cloudflare to ${service}. Recognized names are replaced with tags before sending. Turn does not send your whole phrase bank. A line or phrase can still reveal health details, such as a clinic visit or pain.`
    },
    {
      title: 'Service records',
      body: 'The relay keeps a hashed app ID and free-line count. Cloudflare request logs are kept for up to three days. The AI service may keep submitted text to make the service work, produce telemetry, monitor fraud or abuse, and meet legal duties. The submitted text is not used to train the decision model. Turn does not keep audio recordings or transcripts.'
    },
    {
      title: 'Purchases',
      body: 'RevenueCat receives an app user ID and purchase information to provide and restore Turn Listen. The relay receives the app ID and stores a hash of it to track free lines and access. RevenueCat keeps purchase records under its own policy.'
    },
    {
      title: 'Age and people nearby',
      body: 'Turn is for adults. Do not use Listen mode with a partner under 18. Pause listening when other people are talking nearby.'
    }
  ]
}

export const privacyNotices = {
  unnamed: notice('a third-party AI service in the United States'),
  named: notice('TypeSafe, an AI service in the United States')
} as const

export function selectPrivacyNotice(typesafeNamed: boolean): readonly NoticeSection[] {
  return typesafeNamed ? privacyNotices.named : privacyNotices.unnamed
}
