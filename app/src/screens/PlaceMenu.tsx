import { SymbolView } from 'expo-symbols'
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import type { Place } from '../bank/store'
import { colors } from '../constants/theme'
import { placeSymbol } from './category-style'
import { useDepth } from './home-depth'
import { Layer, usePress } from './home-press'
import TurnText from './TurnText'

type Props = {
  // The place chip's frame in the window; null hides the menu.
  anchor: { x: number; y: number; height: number } | null
  places: readonly Place[]
  selectedId: string | null
  boldText: boolean
  fontScale: number
  onChoose: (id: string) => void
  onEdit: () => void
  onClose: () => void
}

// One row of the menu: a place, or Edit places. Pressed, it turns `surface-pressed` and fades back over 120 ms.
function MenuRow({
  label,
  symbol,
  size,
  current,
  place,
  boldText,
  onPress
}: {
  label: string
  symbol: ReturnType<typeof placeSymbol> | 'pencil'
  size: number
  current: boolean
  // False for Edit places, which chooses nothing.
  place: boolean
  boldText: boolean
  onPress: () => void
}) {
  const press = usePress()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={place ? { selected: current } : undefined}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      style={{
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 18,
        paddingVertical: 8
      }}
    >
      <Layer fill={current ? colors['accent-soft'] : colors.surface} radius={0} />
      <Layer fill={colors['surface-pressed']} radius={0} style={press.style} />
      <SymbolView name={symbol} size={size} weight="semibold" tintColor={colors.ink} accessible={false} />
      <TurnText kind={current ? 'headline' : 'body'} boldText={boldText} style={{ color: colors.ink, flex: 1 }}>
        {label}
      </TurnText>
      {current && (
        <SymbolView
          name="checkmark"
          size={Math.round(size * 0.9)}
          weight="semibold"
          tintColor={colors.ink}
          accessible={false}
        />
      )}
    </Pressable>
  )
}

/** The place picker's menu (plan 0044, frame 24): a raised `surface` menu under the chip, the current place on
 * `accent-soft` with a check, and one tap on a place chooses it (PLACE-1). A tap anywhere outside it closes it; the
 * board behind stays as it is. */
export default function PlaceMenu({
  anchor,
  places,
  selectedId,
  boldText,
  fontScale,
  onChoose,
  onEdit,
  onClose
}: Props) {
  const depth = useDepth()
  const { width, height } = useWindowDimensions()
  const menuWidth = fontScale >= 1.786 ? width - 32 : Math.min(250, width - 32)
  const left = anchor ? Math.max(16, Math.min(anchor.x, width - 16 - menuWidth)) : 16
  const top = anchor ? anchor.y + anchor.height + 8 : 0
  const symbol = Math.round(20 * Math.min(fontScale, 2.6))

  return (
    <Modal visible={anchor !== null} transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close menu"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      />
      {anchor && (
        <View
          onAccessibilityEscape={onClose}
          style={{
            position: 'absolute',
            top,
            left,
            width: menuWidth,
            maxHeight: height - top - 40,
            borderRadius: 24,
            backgroundColor: colors.surface,
            boxShadow: depth.raised
          }}
        >
          <ScrollView bounces={false} style={{ borderRadius: 24 }} contentContainerStyle={{ paddingVertical: 6 }}>
            {places.map((place) => (
              <MenuRow
                key={place.id}
                label={place.name}
                symbol={placeSymbol(place.id)}
                size={symbol}
                current={place.id === selectedId}
                place
                boldText={boldText}
                onPress={() => onChoose(place.id)}
              />
            ))}
            <View style={{ height: 1, backgroundColor: colors.hairline }} />
            <MenuRow
              label="Edit places"
              symbol="pencil"
              size={symbol}
              current={false}
              place={false}
              boldText={boldText}
              onPress={onEdit}
            />
          </ScrollView>
        </View>
      )}
    </Modal>
  )
}
