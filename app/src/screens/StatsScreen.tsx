import { useSyncExternalStore } from 'react'
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native'
import { colors } from '../constants/theme'
import { formatSeconds } from '../stats/store'
import { useTurn } from '../turn-context'
import Button from './Button'
import type { SymbolName } from './category-style'
import { ScreenTitle, SymbolTile, tileTones, useScreenTitle, type TileTone } from './ListGroup'
import TurnText from './TurnText'

type Card = { label: string; value: string; symbol: SymbolName; tone: TileTone }

export default function StatsScreen() {
  const { ready, boldText } = useTurn()
  if (!ready) return null
  return <StatsContent stats={ready.stats} boldText={boldText} />
}

// One card per count, with its number large (SET-4, METRIC-3); from AX1 the cards take one column.
function StatCard({ card, boldText }: { card: Card; boldText: boolean }) {
  const none = card.value === formatSeconds(null)
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${card.label}, ${card.value}`}
      style={{
        flex: 1,
        gap: 8,
        padding: 16,
        borderRadius: 20,
        borderCurve: 'continuous',
        borderWidth: 1.5,
        borderColor: colors.edge,
        backgroundColor: colors.surface
      }}
    >
      <SymbolTile symbol={card.symbol} tone={card.tone} />
      <TurnText kind="large-title" boldText={boldText} style={{ color: none ? colors['ink-secondary'] : colors.ink }}>
        {card.value}
      </TurnText>
      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
        {card.label}
      </TurnText>
    </View>
  )
}

function StatsContent({
  stats,
  boldText
}: {
  stats: NonNullable<ReturnType<typeof useTurn>['ready']>['stats']
  boldText: boolean
}) {
  const snapshot = useSyncExternalStore(stats.subscribe, stats.getSnapshot)
  const oneColumn = useWindowDimensions().fontScale >= 1.786
  const { onTitleLayout, scrollProps } = useScreenTitle('Stats on this phone')

  const cards: Card[] = [
    { label: 'Partner lines', value: String(snapshot.lines), symbol: 'ear', tone: tileTones.listen },
    {
      label: 'Replies from the row',
      value: String(snapshot.fromRow),
      symbol: 'bubble.left.and.bubble.right.fill',
      tone: tileTones.accent
    },
    {
      label: 'Replies from the grid or keyboard',
      value: String(snapshot.fromGrid),
      symbol: 'keyboard',
      tone: tileTones.accent
    },
    { label: 'Time to the row', value: formatSeconds(snapshot.toRowMs), symbol: 'waveform', tone: tileTones.listen },
    {
      label: 'Time to speech',
      value: formatSeconds(snapshot.toSpeechMs),
      symbol: 'speaker.wave.2.fill',
      tone: tileTones.accent
    }
  ]
  const rows = oneColumn ? cards.map((card) => [card]) : [cards.slice(0, 2), cards.slice(2, 4), cards.slice(4)]

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 12 }}
    >
      <View style={{ marginBottom: 4 }}>
        <ScreenTitle title="Stats on this phone" boldText={boldText} onLayout={onTitleLayout} />
      </View>
      {rows.map((row) => (
        <View key={row[0].label} style={{ flexDirection: 'row', gap: 12 }}>
          {row.map((card) => (
            <StatCard key={card.label} card={card} boldText={boldText} />
          ))}
        </View>
      ))}
      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'], marginTop: 10 }}>
        These counts stay on this phone.
      </TurnText>
      <View style={{ marginTop: 10 }}>
        <Button
          variant="destructive"
          label="Reset stats"
          boldText={boldText}
          onPress={() =>
            Alert.alert('Reset stats?', 'This sets the counts back to zero.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: () => void stats.reset() }
            ])
          }
        />
      </View>
    </ScrollView>
  )
}
