import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, scaledTextStyle } from '../constants/theme'
import HomeScreen from '../screens/HomeScreen'
import { useTurn } from '../turn-context'

export default function HomeRoute() {
  const { ready, error, boldText, fontScale } = useTurn()
  if (ready) return <HomeScreen bank={ready.bank} speech={ready.speech} listen={ready.listen} boldText={boldText} />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.board, justifyContent: 'center', padding: 20 }}>
      <Text allowFontScaling={false} style={{ ...scaledTextStyle('body', boldText, fontScale), color: colors.ink }}>
        {error ? `Turn could not load its phrase bank: ${error}` : 'Loading phrases…'}
      </Text>
    </SafeAreaView>
  )
}
