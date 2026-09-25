import * as Application from 'expo-application'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Alert, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import { rebuildGazetteer } from '../listen/gazetteer'
import { runTagChecks } from '../listen/tag-checks'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

type Row = { label: string; value?: string; open?: () => void }

export default function SettingsScreen() {
  const router = useRouter()
  const { ready, boldText } = useTurn()

  const checkNameTags = async () => {
    const finder = ready?.nameTagger
    if (!ready || !finder) return
    try {
      const results = await runTagChecks(finder)
      Alert.alert(
        'Check name tags',
        results
          .map(({ name, passed, taggedText }) => `${passed ? 'PASS' : 'FAIL'}: ${name}\n${taggedText}`)
          .join('\n\n')
      )
    } catch (cause) {
      Alert.alert('Check name tags', `The checks could not finish. ${String(cause)}`)
    } finally {
      try {
        const [phrases, places] = await Promise.all([ready.bank.phrases('all'), ready.bank.places()])
        await rebuildGazetteer({ phrases, places }, finder)
      } catch {
        // A later bank edit retries the local gazetteer rebuild.
      }
    }
  }

  const debugRows: Row[] =
    __DEV__ && ready?.nameTagger ? [{ label: 'Check name tags', open: () => void checkNameTags() }] : []

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
        { label: 'Relay status' },
        ...debugRows
      ]
    },
    { title: 'More', rows: [{ label: 'Stats on this phone' }, { label: 'Erase all data' }] }
  ]

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 }}>
        {sections.map((section) => (
          <View key={section.title} style={{ gap: 8 }}>
            <TurnText
              kind="subheadline-emphasized"
              boldText={boldText}
              style={{ color: colors['ink-secondary'], marginLeft: 12 }}
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
                      borderTopWidth: index === 0 ? 0 : 1,
                      borderTopColor: colors.edge,
                      backgroundColor: disabled ? colors.surface : pressed ? colors['surface-pressed'] : colors.surface
                    })}
                  >
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
                      <SymbolView
                        name="chevron.right"
                        size={15}
                        tintColor={colors['ink-secondary']}
                        accessible={false}
                      />
                    )}
                  </Pressable>
                )
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
