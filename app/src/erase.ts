export async function eraseAllData(parts: {
  listen: { end(): Promise<void> }
  speech: { stop(): void }
  stats: { reset(): Promise<void> }
  bank: { eraseAll(): Promise<void> }
}): Promise<void> {
  await parts.listen.end()
  parts.speech.stop()
  await parts.stats.reset()
  await parts.bank.eraseAll()
}
