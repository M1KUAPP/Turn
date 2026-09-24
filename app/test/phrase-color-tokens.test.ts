import { expect, test, vi } from 'vitest'

vi.mock('react-native', () => ({ DynamicColorIOS: ({ light }: { light: string }) => light }))
vi.mock('expo-symbols', () => ({ SymbolView: () => null }))

test('maps fixed reply ids to their shared fill and edge tokens', async () => {
  const row = await import('../src/screens/ReplyRow')

  expect(row.phraseColorTokensForId).toBeTypeOf('function')
  expect(row.phraseColorTokensForId('yes')).toEqual({ fill: 'yes-fill', edge: 'yes-edge' })
  expect(row.phraseColorTokensForId('no')).toEqual({ fill: 'no-fill', edge: 'no-edge' })
  expect(row.phraseColorTokensForId('not-sure')).toEqual({ fill: 'unsure-fill', edge: 'unsure-edge' })
  expect(row.phraseColorTokensForId('other')).toBeNull()
})
