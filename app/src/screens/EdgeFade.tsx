import { useColorScheme, View } from 'react-native'
import { colorValues } from '../constants/theme'

type Token = keyof typeof colorValues
type Side = 'top' | 'bottom' | 'left' | 'right'

/** A token's plain color in this appearance, since a gradient needs values it can mix. */
export function useTokenHex(token: Token, increaseContrast: boolean): string {
  const dark = useColorScheme() === 'dark'
  return colorValues[token][dark ? (increaseContrast ? 'dark-hc' : 'dark') : increaseContrast ? 'light-hc' : 'light']
}

/** A gradient from clear to `hex` toward `side`, eased so it starts softly; with `length`, it's solid past that many
 * points. */
export function fadeToward(side: Side, hex: string, length?: number): string {
  const [r, g, b] = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16))
  const at = (fraction: number) => (length === undefined ? `${fraction * 100}%` : `${fraction * length}px`)
  return `linear-gradient(to ${side}, rgba(${r},${g},${b},0) ${at(0)}, rgba(${r},${g},${b},0.2) ${at(0.3)}, rgba(${r},${g},${b},0.65) ${at(0.65)}, rgba(${r},${g},${b},1) ${at(1)})`
}

/** A soft edge where content is cut off (a scroll view's end, a picture's crop): `size` points of the color behind it,
 * fading in toward `side`, so a card, a tab, or a picture fades out there rather than stopping at a hard line. It
 * never takes a touch. */
export default function EdgeFade({
  side,
  size,
  token,
  increaseContrast
}: {
  side: Side
  size: number
  token: Token
  increaseContrast: boolean
}) {
  const hex = useTokenHex(token, increaseContrast)
  const across =
    side === 'top' || side === 'bottom' ? { left: 0, right: 0, height: size } : { top: 0, bottom: 0, width: size }
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', [side]: 0, ...across, experimental_backgroundImage: fadeToward(side, hex) }}
    />
  )
}
