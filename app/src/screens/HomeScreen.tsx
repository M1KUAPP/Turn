import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { FlatList, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Category, Phrase, createBankStore } from '../bank/store'
import { colors, scaledTextStyle, type typography } from '../constants/theme'
import type { createSpeechController } from '../speech/controller'

type Props = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
  boldText: boolean
}

export default function HomeScreen({ bank, speech, boldText }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [categoryId, setCategoryId] = useState('quick')
  const [offset, setOffset] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(1)
  const [contentHeight, setContentHeight] = useState(1)
  const list = useRef<FlatList<Phrase>>(null)
  const { width, height, fontScale } = useWindowDimensions()
  const columns = width >= 350 && fontScale < 1.6 ? 2 : 1
  const minHeight = height < 700 ? 64 : 78
  const tabHeight = Math.max(44, 20 * fontScale + 24)
  const controlHeight = Math.max(44, 22 * fontScale + 16)
  const largeControls = fontScale >= 1.6
  const type = (name: keyof typeof typography) => scaledTextStyle(name, boldText, fontScale)
  const speaking = useSyncExternalStore(speech.subscribe, speech.getSnapshot)

  useEffect(() => {
    let alive = true
    const read = () => {
      void Promise.all([bank.categories(), bank.phrases(categoryId)]).then(([nextCategories, nextPhrases]) => {
        if (alive) {
          setCategories(nextCategories)
          setPhrases(nextPhrases)
        }
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      alive = false
      unsubscribe()
    }
  }, [bank, categoryId])

  const chooseCategory = (id: string) => {
    setCategoryId(id)
    setOffset(0)
    list.current?.scrollToOffset({ offset: 0, animated: false })
  }
  const page = (direction: number) => {
    const next = Math.max(0, Math.min(contentHeight - viewportHeight, offset + direction * viewportHeight))
    list.current?.scrollToOffset({ offset: next, animated: true })
  }
  const renderPhrase = ({ item }: { item: Phrase }) => {
    const tone = item.id === 'yes' ? 'yes' : item.id === 'no' ? 'no' : item.id === 'not-sure' ? 'unsure' : null
    const fill = tone ? colors[`${tone}-fill`] : colors.surface
    const edge = tone ? colors[`${tone}-edge`] : colors.edge
    return (
      <View style={{ flex: 1, maxWidth: columns === 2 ? (width - 44) / 2 : undefined }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.text}
          onPress={() => {
            void speech.speak(item.text, item.id)
          }}
          style={({ pressed }) => ({
            flex: 1,
            minHeight,
            borderWidth: 1.5,
            borderColor: edge,
            borderRadius: 12,
            padding: 12,
            backgroundColor: pressed ? colors['surface-pressed'] : fill,
            justifyContent: 'center'
          })}
        >
          <Text allowFontScaling={false} style={{ ...type('title3-emphasized'), color: colors.ink, textAlign: 'left' }}>
            {item.text}
          </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.board }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
        <Text
          allowFontScaling={false}
          accessibilityRole="header"
          style={{ ...type('largeTitle-emphasized'), color: colors.ink }}
        >
          Turn
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: tabHeight + 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={{ flexGrow: 1, height: tabHeight + 16 }}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, paddingVertical: 8, gap: 8 }}
        >
          {categories.map((category) => {
            const selected = categoryId === category.id
            return (
              <Pressable
                key={category.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => chooseCategory(category.id)}
                style={{
                  minHeight: tabHeight,
                  minWidth: 44,
                  justifyContent: 'center',
                  paddingHorizontal: 16,
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: colors.edge,
                  backgroundColor: selected ? colors.ink : colors.surface
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{ ...type('subheadline-emphasized'), color: selected ? colors.surface : colors.ink }}
                >
                  {category.name}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: categoryId === 'all' }}
          onPress={() => chooseCategory('all')}
          style={{
            minHeight: tabHeight,
            minWidth: 44,
            justifyContent: 'center',
            paddingHorizontal: 16,
            marginRight: 16,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: colors.edge,
            backgroundColor: categoryId === 'all' ? colors.ink : colors.surface
          }}
        >
          <Text
            allowFontScaling={false}
            style={{ ...type('subheadline-emphasized'), color: categoryId === 'all' ? colors.surface : colors.ink }}
          >
            All
          </Text>
        </Pressable>
      </View>
      <FlatList
        key={columns}
        ref={list}
        data={phrases}
        keyExtractor={(item) => item.id}
        renderItem={renderPhrase}
        numColumns={columns}
        columnWrapperStyle={columns === 2 ? { gap: 12, alignItems: 'stretch' } : undefined}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        onScroll={(event) => setOffset(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={100}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        onContentSizeChange={(_, content) => setContentHeight(content)}
        showsVerticalScrollIndicator
        ListFooterComponent={
          __DEV__ ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void bank.seedDebugPhrases()
              }}
              style={{ alignSelf: 'center', minHeight: 44, justifyContent: 'center', paddingVertical: 8 }}
            >
              <Text allowFontScaling={false} style={{ ...type('footnote'), color: colors['ink-secondary'] }}>
                Seed 2,000 test phrases
              </Text>
            </Pressable>
          ) : null
        }
      />
      <View
        style={{
          minHeight: 52,
          flexDirection: 'row',
          flexWrap: largeControls ? 'wrap' : 'nowrap',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 4,
          borderTopWidth: 1,
          borderTopColor: colors.edge
        }}
      >
        {[
          {
            label: speaking.speaking ? 'Stop' : 'Repeat',
            action: () => {
              void (speaking.speaking ? speech.stop() : speech.repeat())
            },
            disabled: !speaking.speaking && !speaking.lastText
          },
          { label: 'Up', action: () => page(-1), disabled: offset <= 0 },
          { label: 'Down', action: () => page(1), disabled: offset >= contentHeight - viewportHeight }
        ].map(({ label, action, disabled }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={action}
            style={({ pressed }) => ({
              flex: largeControls ? undefined : 1,
              width: largeControls ? (label === 'Stop' || label === 'Repeat' ? '100%' : '48%') : undefined,
              minHeight: controlHeight,
              minWidth: 44,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: colors.edge,
              backgroundColor: pressed ? colors['surface-pressed'] : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 0.45 : 1
            })}
          >
            <Text allowFontScaling={false} style={{ ...type('headline'), color: colors.ink }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  )
}
