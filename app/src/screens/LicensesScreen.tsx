import { useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import iosLicenses from '../content/ios-licenses.json'
import licenses from '../content/open-source-licenses.json'
import { colors, textStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

type LicenseEntry = {
  name: string
  version?: string
  license: string
  text: string | null
  source: 'JavaScript' | 'iOS'
}

const allLicenses: LicenseEntry[] = [
  ...licenses.map((entry) => ({ ...entry, source: 'JavaScript' as const })),
  ...iosLicenses.map((entry) => ({ ...entry, source: 'iOS' as const }))
]

export default function LicensesScreen() {
  const { boldText } = useTurn()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return needle ? allLicenses.filter((entry) => entry.name.toLocaleLowerCase().includes(needle)) : allLicenses
  }, [query])

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <FlatList
        data={results}
        keyExtractor={(entry) => `${entry.source}/${entry.name}@${entry.version ?? ''}`}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 }}
        ListHeaderComponent={
          <View style={{ gap: 12, paddingBottom: 20 }}>
            <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
              Licenses for {allLicenses.length} packages and native libraries used to build and run Turn. Search by
              name.
            </TurnText>
            <TextInput
              accessibilityLabel="Search packages"
              value={query}
              onChangeText={setQuery}
              placeholder="Search packages"
              placeholderTextColor={colors['ink-secondary']}
              autoCorrect={false}
              style={[
                textStyle('body', boldText),
                {
                  minHeight: 52,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  color: colors.ink,
                  backgroundColor: colors.surface
                }
              ]}
            />
          </View>
        }
        ListEmptyComponent={
          <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            No packages found.
          </TurnText>
        }
        renderItem={({ item, index }) => {
          const key = `${item.source}/${item.name}@${item.version ?? ''}`
          const open = expanded === key
          const first = index === 0
          const last = index === results.length - 1
          return (
            <Pressable
              accessibilityRole={item.text ? 'button' : 'text'}
              accessibilityHint={item.text ? 'Shows the license text' : undefined}
              accessibilityState={item.text ? { expanded: open } : undefined}
              disabled={!item.text}
              onPress={() => setExpanded(open ? null : key)}
              style={({ pressed }) => ({
                minHeight: 52,
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 6,
                borderTopLeftRadius: first ? 12 : 0,
                borderTopRightRadius: first ? 12 : 0,
                borderBottomLeftRadius: last ? 12 : 0,
                borderBottomRightRadius: last ? 12 : 0,
                backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
              })}
            >
              {!first && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 16,
                    right: 0,
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.edge
                  }}
                />
              )}
              <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
                {item.name} {item.version ?? ''}
              </TurnText>
              <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                {item.license}
              </TurnText>
              {open && item.text && (
                <TurnText kind="body" boldText={boldText} style={{ color: colors.ink, paddingTop: 10 }}>
                  {item.text}
                </TurnText>
              )}
            </Pressable>
          )
        }}
      />
    </SafeAreaView>
  )
}
