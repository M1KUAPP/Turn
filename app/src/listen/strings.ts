export const listenStrings = {
  off: 'Listen mode is off.',
  listening: 'Listening',
  saying: "They're saying",
  said: 'They said',
  stillAnswering: (line: string) => `Still answering “${line}”`,
  rankedOnPhone: 'Ranked on this phone',
  unavailable: "Live transcription isn't available here. Tap here to type what they say.",
  gettingModel: "Getting Apple's English speech model",
  typedLinePrompt: 'Tap here to type what they say.'
} as const
