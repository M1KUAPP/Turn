import { SymbolView } from 'expo-symbols'
import { useMemo, useState } from 'react'
import { FlatList, Pressable, TextInput, View } from 'react-native'
import iosLicenses from '../content/ios-licenses.json'
import licenses from '../content/open-source-licenses.json'
import { colors, textStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import { ScreenTitle, useListMetrics, useScreenTitle } from './ListGroup'
import PressFill from './PressFill'
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
  const { mark } = useListMetrics()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const { onTitleLayout, scrollProps } = useScreenTitle('Licenses')
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return needle ? allLicenses.filter((entry) => entry.name.toLocaleLowerCase().includes(needle)) : allLicenses
  }, [query])

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      style={{ flex: 1, backgroundColor: colors.board }}
      data={results}
      keyExtractor={(entry) => `${entry.source}/${entry.name}@${entry.version ?? ''}`}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 48 }}
      ListHeaderComponent={
        <View style={{ gap: 12, paddingBottom: 16 }}>
          <ScreenTitle title="Licenses" boldText={boldText} onLayout={onTitleLayout} />
          <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'], marginHorizontal: 4 }}>
            Licenses for {allLicenses.length} packages and native libraries used to build and run Turn. Search by name.
          </TurnText>
          <TextInput
            accessibilityLabel="Search packages"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search packages"
            placeholderTextColor={colors['ink-secondary']}
            selectionColor={colors.accent}
            autoCorrect={false}
            style={[
              textStyle('body', boldText),
              {
                minHeight: 56,
                paddingHorizontal: 18,
                paddingVertical: 14,
                borderWidth: focused ? 2.5 : 1.5,
                borderColor: focused ? colors.accent : colors.edge,
                borderRadius: 24,
                borderCurve: 'continuous',
                color: colors.ink,
                backgroundColor: colors.surface
              }
            ]}
          />
        </View>
      }
      ListEmptyComponent={
        <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'], marginHorizontal: 4 }}>
          No packages found.
        </TurnText>
      }
      renderItem={({ item, index }) => {
        const key = `${item.source}/${item.name}@${item.version ?? ''}`
        const open = expanded === key
        const first = index === 0
        const last = index === results.length - 1
        return (
          // The rows draw one inset group between them: its edge, its corners, and hairlines between rows.
          <View
            style={{
              borderLeftWidth: 1.5,
              borderRightWidth: 1.5,
              borderTopWidth: first ? 1.5 : 0,
              borderBottomWidth: last ? 1.5 : 0,
              borderColor: colors.edge,
              borderTopLeftRadius: first ? 24 : 0,
              borderTopRightRadius: first ? 24 : 0,
              borderBottomLeftRadius: last ? 24 : 0,
              borderBottomRightRadius: last ? 24 : 0,
              backgroundColor: colors.surface,
              overflow: 'hidden'
            }}
          >
            {!first && <View style={{ height: 1, marginLeft: 16, backgroundColor: colors.hairline }} />}
            <Pressable
              accessibilityRole={item.text ? 'button' : 'text'}
              accessibilityHint={item.text ? 'Shows the license text' : undefined}
              accessibilityState={item.text ? { expanded: open } : undefined}
              disabled={!item.text}
              onPress={() => setExpanded(open ? null : key)}
              style={{
                minHeight: 56,
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 8
              }}
            >
              {({ pressed }) => (
                <>
                  <PressFill pressed={pressed} color={colors['surface-pressed']} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
                        {item.name} · {item.license}
                      </TurnText>
                      {item.version ? (
                        <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                          {item.version}
                        </TurnText>
                      ) : null}
                    </View>
                    {item.text && (
                      <SymbolView
                        name={open ? 'chevron.down' : 'chevron.right'}
                        size={mark}
                        weight="semibold"
                        tintColor={colors['ink-secondary']}
                        accessible={false}
                      />
                    )}
                  </View>
                  {open && item.text && (
                    <TurnText kind="footnote" boldText={boldText} style={{ color: colors.ink }}>
                      {item.text}
                    </TurnText>
                  )}
                </>
              )}
            </Pressable>
          </View>
        )
      }}
    />
  )
}
