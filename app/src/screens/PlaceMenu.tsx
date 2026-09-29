import { SymbolView } from 'expo-symbols'
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import type { Place } from '../bank/store'
import { colors } from '../constants/theme'
import { placeSymbol } from './category-palette'
import { useDepth } from './home-depth'
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

/** The place picker's menu (plan 0044, frame 24): a raised `surface` menu under the chip, the current place on
 * `accent-soft` with a check, and one tap on a place chooses it (PLACE-1). A tap outside closes it. */
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

  const row = (key: string, label: string, name: Parameters<typeof placeSymbol>[0] | null, current: boolean) => (
    <Pressable
      key={key}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={name ? { selected: current } : undefined}
      onPress={() => (name === null ? onEdit() : onChoose(key))}
      style={({ pressed }) => ({
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: pressed ? colors['surface-pressed'] : current ? colors['accent-soft'] : colors.surface
      })}
    >
      <SymbolView
        name={name === null ? 'pencil' : placeSymbol(name)}
        size={symbol}
        weight="semibold"
        tintColor={colors.ink}
        accessible={false}
      />
      <TurnText kind={current ? 'headline' : 'body'} boldText={boldText} style={{ color: colors.ink, flex: 1 }}>
        {label}
      </TurnText>
      {current && (
        <SymbolView
          name="checkmark"
          size={Math.round(symbol * 0.9)}
          weight="semibold"
          tintColor={colors.ink}
          accessible={false}
        />
      )}
    </Pressable>
  )

  return (
    <Modal visible={anchor !== null} transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close menu"
        onPress={onClose}
        style={[StyleSheet.absoluteFill, { backgroundColor: depth.scrim }]}
      />
      {anchor && (
        <View
          accessibilityViewIsModal
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
            {places.map((place) => row(place.id, place.name, place.id, place.id === selectedId))}
            <View style={{ height: 1, backgroundColor: colors.hairline }} />
            {row('edit-places', 'Edit places', null, false)}
          </ScrollView>
        </View>
      )}
    </Modal>
  )
}
