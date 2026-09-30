import { SymbolView } from 'expo-symbols'
import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { Dimensions, Keyboard, Pressable, useWindowDimensions, View, type KeyboardEvent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import { useTurn } from '../turn-context'
import EdgeFade from './EdgeFade'
import PressFill from './PressFill'
import { keyboardInset } from './sheet-layout'
import TurnText from './TurnText'

type Props = {
  title: string
  boldText: boolean
  onClose: () => void
  closeLabel?: string
}

/** A 44-point close button (DESIGN, symbol buttons): `xmark` on `surface-sunken` with a 1.5 `edge`, as sheets and the
 * composers use it. */
export function CloseButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { fontScale } = useWindowDimensions()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        borderWidth: 1.5,
        borderColor: colors.edge,
        backgroundColor: colors['surface-sunken']
      }}
    >
      {({ pressed }) => (
        <>
          <PressFill pressed={pressed} color={colors['surface-pressed']} radius={20.5} />
          <SymbolView
            name="xmark"
            size={Math.round(16 * Math.min(fontScale, 1.4))}
            weight="semibold"
            tintColor={colors.ink}
            accessible={false}
          />
        </>
      )}
    </Pressable>
  )
}

// Plan 0044's Sheet header: a grabber, the title in `title`, and a 44-point close button, on the sheet's board.
export default function SheetHeader({ title, boldText, onClose, closeLabel = 'Cancel' }: Props) {
  return (
    <View style={{ paddingTop: 6, paddingHorizontal: 16, paddingBottom: 12 }}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 2.5, backgroundColor: colors.hairline }}
      />
      <View style={{ minHeight: 44, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TurnText kind="title" boldText={boldText} accessibilityRole="header" style={{ flex: 1, color: colors.ink }}>
          {title}
        </TurnText>
        <CloseButton label={closeLabel} onPress={onClose} />
      </View>
    </View>
  )
}

/** A sheet's buttons, pinned under its content so they stay above the keyboard; from AX1 they stack, the last, the
 * sheet's main button, on top. Content that scrolls on under them fades into the board over the 16 points above them,
 * rather than stopping at a hard line. */
export function SheetActions({ children }: { children: ReactNode }) {
  const stacked = useWindowDimensions().fontScale >= 1.786
  const { increaseContrast } = useTurn()
  const buttons = Children.toArray(children)
  return (
    <View
      style={{
        flexDirection: stacked ? 'column-reverse' : 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16
      }}
    >
      <View pointerEvents="none" style={{ position: 'absolute', top: -16, left: 0, right: 0, height: 16 }}>
        <EdgeFade side="bottom" size={16} token="board" increaseContrast={increaseContrast} />
      </View>
      {buttons.map((button, index) => (
        <View key={index} style={stacked ? undefined : { flex: 1 }}>
          {button}
        </View>
      ))}
    </View>
  )
}

/** A page sheet's content, on the board, that keeps its bottom, and the buttons pinned there, above the keyboard.
 * React Native's KeyboardAvoidingView measures against its parent, and inside a sheet a view measures against the
 * sheet, which starts below the top of the screen, so both lift too little; this adds the sheet's own offset. */
export function SheetBody({ children }: { children: ReactNode }) {
  const root = useRef<View>(null)
  const body = useRef<View>(null)
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const fit = (event: KeyboardEvent) => {
      root.current?.measureInWindow((_rootX, _rootY, _rootWidth, rootHeight) => {
        body.current?.measureInWindow((_x, y, _width, height) =>
          setInset(
            keyboardInset(Dimensions.get('window').height, rootHeight, { y, height }, event.endCoordinates.screenY)
          )
        )
      })
    }
    const subscriptions = [
      Keyboard.addListener('keyboardWillChangeFrame', fit),
      Keyboard.addListener('keyboardDidChangeFrame', fit),
      Keyboard.addListener('keyboardWillHide', () => setInset(0))
    ]
    return () => subscriptions.forEach((subscription) => subscription.remove())
  }, [])

  return (
    <View ref={root} style={{ flex: 1, backgroundColor: colors.board }}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
        <View ref={body} style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingBottom: inset }}>{children}</View>
        </View>
      </SafeAreaView>
    </View>
  )
}
