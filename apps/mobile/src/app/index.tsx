import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import HomeScreen from '../screens/HomeScreen'
import TurnText from '../screens/TurnText'
import { useTurn } from '../turn-context'

export default function HomeRoute() {
  const { ready, error, boldText, reduceMotion, increaseContrast, reduceTransparency } = useTurn()
  if (ready)
    return (
      <HomeScreen
        bank={ready.bank}
        speech={ready.speech}
        listen={ready.listen}
        boldText={boldText}
        reduceMotion={reduceMotion}
        increaseContrast={increaseContrast}
        reduceTransparency={reduceTransparency}
      />
    )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.board, justifyContent: 'center', padding: 20 }}>
      <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
        {error ? `Turn could not load its phrase bank: ${error}` : 'Loading phrases…'}
      </TurnText>
    </SafeAreaView>
  )
}
