import { useRef, useState } from 'react'
import { Pressable, ScrollView, View, type ColorValue } from 'react-native'
import { colors } from '../constants/theme'
import EdgeFade from './EdgeFade'
import { Layer, usePress } from './home-press'
import TurnText from './TurnText'

type Props = {
  categories: readonly { id: string; name: string }[]
  selectedId: string
  suggestedId: string | null
  paletteFor: (categoryId: string) => { fill: ColorValue; edge: ColorValue }
  tabHeight: number
  tabMargin: number
  fontScale: number
  boldText: boolean
  increaseContrast: boolean
  onChoose: (id: string) => void
}

function Tab({
  name,
  selected,
  suggested,
  dot,
  height,
  dotSize,
  boldText,
  onPress
}: {
  name: string
  selected: boolean
  suggested: boolean
  dot: ColorValue | null
  height: number
  dotSize: number
  boldText: boolean
  onPress: () => void
}) {
  const press = usePress()
  // The tab ROW-9 marks keeps its dot and takes a 2.5 edge in its category's color, a shape as well as a hue.
  const edge = suggested && dot ? dot : colors.edge
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityValue={suggested ? { text: 'suggested' } : undefined}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      style={{
        minHeight: height,
        minWidth: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
        borderRadius: 999
      }}
    >
      <Layer
        fill={selected ? colors.ink : colors.surface}
        edge={edge}
        edgeWidth={suggested ? 2.5 : selected ? 0 : 1.5}
        radius={999}
      />
      {/* Pressed, the selected tab's `ink` turns `ink-secondary`, as Stop's does; the others take `surface-pressed`. */}
      <Layer
        fill={selected ? colors['ink-secondary'] : colors['surface-pressed']}
        edge={edge}
        edgeWidth={selected && !suggested ? 0 : 2.5}
        radius={999}
        style={press.style}
      />
      {dot && (
        <View
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: dot,
            borderWidth: selected ? 1.5 : 0,
            borderColor: colors.surface
          }}
        />
      )}
      <TurnText kind="label" boldText={boldText} style={{ color: selected ? colors.surface : colors.ink }}>
        {name}
      </TurnText>
    </Pressable>
  )
}

/** The grid's tabs (DESIGN, the tabs): one chip per category with its 10-point dot, the selected one on `ink`, and All
 * pinned at the trailing end outside the scroll. While tabs run on past All, the last visible one fades into the board
 * before it, so a cut-off name reads as more to scroll rather than a hard stop. */
export default function CategoryTabs({
  categories,
  selectedId,
  suggestedId,
  paletteFor,
  tabHeight,
  tabMargin,
  fontScale,
  boldText,
  increaseContrast,
  onChoose
}: Props) {
  const dotSize = Math.round(10 * Math.min(fontScale, 2))
  const scroll = useRef({ offset: 0, content: 0, viewport: 0 })
  const [moreAfter, setMoreAfter] = useState(false)
  const measure = (next: Partial<typeof scroll.current>) => {
    const current = Object.assign(scroll.current, next)
    setMoreAfter(current.content - current.offset - current.viewport > 1)
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: tabHeight + 2 * tabMargin }}>
      <View style={{ flex: 1, height: tabHeight + 2 * tabMargin }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={{ flexGrow: 1, height: tabHeight + 2 * tabMargin }}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, paddingVertical: tabMargin, gap: 8 }}
          onLayout={(event) => measure({ viewport: event.nativeEvent.layout.width })}
          onContentSizeChange={(content) => measure({ content })}
          onScroll={(event) => measure({ offset: event.nativeEvent.contentOffset.x })}
          scrollEventThrottle={32}
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              name={category.name}
              selected={selectedId === category.id}
              suggested={suggestedId === category.id}
              dot={paletteFor(category.id).edge}
              height={tabHeight}
              dotSize={dotSize}
              boldText={boldText}
              onPress={() => onChoose(category.id)}
            />
          ))}
        </ScrollView>
        {moreAfter && <EdgeFade side="right" size={32} token="board" increaseContrast={increaseContrast} />}
      </View>
      <View style={{ marginLeft: 8, marginRight: 16 }}>
        <Tab
          name="All"
          selected={selectedId === 'all'}
          suggested={false}
          dot={null}
          height={tabHeight}
          dotSize={dotSize}
          boldText={boldText}
          onPress={() => onChoose('all')}
        />
      </View>
    </View>
  )
}
