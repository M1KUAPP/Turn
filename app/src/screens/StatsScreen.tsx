import { useSyncExternalStore } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import { colors } from '../constants/theme'
import { formatSeconds } from '../stats/store'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

function Hairline() {
  return (
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
  )
}

export default function StatsScreen() {
  const { ready, boldText } = useTurn()
  if (!ready) return null
  return <StatsContent stats={ready.stats} boldText={boldText} />
}

function StatsContent({
  stats,
  boldText
}: {
  stats: NonNullable<ReturnType<typeof useTurn>['ready']>['stats']
  boldText: boolean
}) {
  const snapshot = useSyncExternalStore(stats.subscribe, stats.getSnapshot)
  const stacked = useWindowDimensions().fontScale >= 1.786

  const rows = [
    { label: 'Partner lines', value: String(snapshot.lines) },
    { label: 'Replies from the row', value: String(snapshot.fromRow) },
    { label: 'Replies from the grid or keyboard', value: String(snapshot.fromGrid) },
    { label: 'Time to the row', value: formatSeconds(snapshot.toRowMs) },
    { label: 'Time to speech', value: formatSeconds(snapshot.toSpeechMs) }
  ]

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 24 }}
    >
      <View style={{ gap: 8 }}>
        <View style={{ borderRadius: 12, backgroundColor: colors.surface, overflow: 'hidden' }}>
          {rows.map(({ label, value }, index) => (
            <Pressable
              key={label}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${label}, ${value}`}
              disabled
              style={{
                minHeight: 52,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: colors.surface
              }}
            >
              {index > 0 && <Hairline />}
              <View
                style={{
                  flex: 1,
                  flexDirection: stacked ? 'column' : 'row',
                  alignItems: stacked ? 'flex-start' : 'center',
                  gap: stacked ? 2 : 12
                }}
              >
                <TurnText kind="body" boldText={boldText} style={{ color: colors.ink, flex: stacked ? undefined : 1 }}>
                  {label}
                </TurnText>
                <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                  {value}
                </TurnText>
              </View>
            </Pressable>
          ))}
        </View>
        <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'], marginLeft: 16 }}>
          These counts stay on this phone.
        </TurnText>
      </View>

      <View style={{ borderRadius: 12, backgroundColor: colors.surface, overflow: 'hidden' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset stats"
          onPress={() =>
            Alert.alert('Reset stats?', 'This sets the counts back to zero.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: () => void stats.reset() }
            ])
          }
          style={({ pressed }) => ({
            minHeight: 52,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
          })}
        >
          <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
            Reset stats
          </TurnText>
        </Pressable>
      </View>
    </ScrollView>
  )
}
