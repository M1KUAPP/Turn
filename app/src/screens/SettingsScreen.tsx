import * as Application from 'expo-application'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { colors } from '../constants/theme'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

type Row = { label: string; value?: string; open?: () => void }

export default function SettingsScreen() {
  const router = useRouter()
  const { boldText } = useTurn()

  const sections: { title: string; rows: Row[] }[] = [
    { title: 'Voice', rows: [{ label: 'Voice' }, { label: 'Speech rate' }, { label: 'Personal Voice' }] },
    { title: 'Listen mode', rows: [{ label: 'Permission' }, { label: 'Under-18 mode' }] },
    {
      title: 'Your words',
      rows: [{ label: 'Places', open: () => router.push('/settings/places') }, { label: 'Phrase bank' }]
    },
    { title: 'Turn Listen', rows: [{ label: 'Unlock Listen mode' }, { label: 'Restore Purchases' }] },
    {
      title: 'About',
      rows: [
        { label: 'Privacy notice', open: () => router.push('/settings/privacy') },
        { label: 'Open-source licenses', open: () => router.push('/settings/licenses') },
        { label: 'Version', value: Application.nativeApplicationVersion ?? '—' },
        { label: 'Relay status' }
      ]
    },
    { title: 'More', rows: [{ label: 'Stats on this phone' }, { label: 'Erase all data' }] }
  ]

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 24 }}
    >
      {sections.map((section) => (
        <View key={section.title} style={{ gap: 8 }}>
          <TurnText
            kind="subheadline-emphasized"
            boldText={boldText}
            style={{ color: colors['ink-secondary'], marginLeft: 16 }}
          >
            {section.title}
          </TurnText>
          <View style={{ borderRadius: 12, backgroundColor: colors.surface, overflow: 'hidden' }}>
            {section.rows.map((row, index) => {
              const enabled = !!row.open
              const disabled = !enabled && !row.value
              return (
                <Pressable
                  key={row.label}
                  accessibilityRole={row.value ? 'text' : 'button'}
                  // Named explicitly: left to iOS, the chevron's symbol adds "Forward" to the name.
                  accessibilityLabel={row.value ? `${row.label}, ${row.value}` : row.label}
                  accessibilityState={row.value ? undefined : { disabled: !enabled }}
                  disabled={!enabled}
                  onPress={row.open}
                  style={({ pressed }) => ({
                    minHeight: 52,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: disabled ? colors.surface : pressed ? colors['surface-pressed'] : colors.surface
                  })}
                >
                  {index > 0 && (
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
                  <TurnText
                    kind="body"
                    boldText={boldText}
                    style={{ color: disabled ? colors['ink-secondary'] : colors.ink, flex: 1 }}
                  >
                    {row.label}
                  </TurnText>
                  {row.value && (
                    <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                      {row.value}
                    </TurnText>
                  )}
                  {enabled && (
                    <SymbolView name="chevron.right" size={15} tintColor={colors['ink-secondary']} accessible={false} />
                  )}
                </Pressable>
              )
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}
