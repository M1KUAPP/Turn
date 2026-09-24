import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import {
  ActionSheetIOS,
  AccessibilityInfo,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Category, Phrase, Place, createBankStore } from '../bank/store'
import { colors } from '../constants/theme'
import type { createTypedListenSession, TypedListenState } from '../listen/typed-session'
import type { createSpeechController } from '../speech/controller'
import { homeLayout, pageOffset } from './home-layout'
import ReplyRow from './ReplyRow'
import PartnerLineComposer from './PartnerLineComposer'
import TurnText from './TurnText'
import TypedComposer from './TypedComposer'

type Props = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
  listen: ReturnType<typeof createTypedListenSession>
  boldText: boolean
}

export default function HomeScreen({ bank, speech, listen, boldText }: Props) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [strip, setStrip] = useState<Phrase[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [categoryId, setCategoryId] = useState('quick')
  const [offset, setOffset] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(1)
  const [contentHeight, setContentHeight] = useState(1)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [replyPreview, setReplyPreview] = useState(0)
  const [composerMode, setComposerMode] = useState<'speak' | 'partner' | null>(null)
  const [draft, setDraft] = useState('')
  const [typeMatches, setTypeMatches] = useState<Phrase[]>([])
  const [touchedRow, setTouchedRow] = useState<TypedListenState | null>(null)
  const list = useRef<FlatList<Phrase>>(null)
  const composerContent = useRef<ScrollView>(null)
  const { width, height, fontScale } = useWindowDimensions()
  const layout = homeLayout(width, height, fontScale)
  const minPhraseHeight = layout.short ? 64 : 78
  const tabHeight = Math.max(44, 20 * Math.min(fontScale, 2.9) + 24)
  const controlHeight = Math.max(44, 22 * Math.min(fontScale, 2.82) + 16)
  const captionHeight = Math.max(layout.short ? 56 : 86, 24 + 70 * fontScale)
  const twoControlRows = width < 352 || fontScale >= 1.786
  const oneControlColumn = fontScale >= 2.5
  const speaking = useSyncExternalStore(speech.subscribe, speech.getSnapshot)
  const listening = useSyncExternalStore(listen.subscribe, listen.getSnapshot)
  const composerOpen = composerMode !== null
  const shownListening = touchedRow ?? listening
  const rowAnnouncement = useRef<{ signature: string; pending: string | null }>({ signature: '', pending: null })
  const captionLabel = listening.active
    ? [
        listening.line ? `They said: ${listening.line}` : 'Tap here to type what they say',
        listening.rankedOnPhone ? 'Ranked on this phone' : null,
        listening.answeringLine ? `Still answering: ${listening.answeringLine}` : null,
        'Type partner line'
      ]
        .filter(Boolean)
        .join('. ')
    : undefined

  useEffect(() => {
    const current = rowAnnouncement.current
    if (!shownListening.active) {
      current.signature = ''
      current.pending = null
      return
    }
    if (touchedRow) return
    const signature = `${shownListening.row.big ?? ''}|${shownListening.row.slots.join('|')}`
    if (signature !== current.signature) {
      current.signature = signature
      const count = shownListening.row.big ? 1 : shownListening.row.slots.filter(Boolean).length
      current.pending =
        shownListening.row.answers > 0 && count > 0 ? `${count} ${count === 1 ? 'reply' : 'replies'}` : null
    }
    if (current.pending && !speaking.speaking) {
      const timer = setTimeout(() => {
        if (current.pending) AccessibilityInfo.announceForAccessibilityWithOptions(current.pending, { queue: true })
        current.pending = null
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [shownListening, touchedRow, speaking.speaking])

  useEffect(() => {
    let alive = true
    const read = () => {
      void Promise.all([
        bank.categories(),
        bank.phrases(categoryId),
        bank.phrases('strip'),
        bank.places(),
        bank.selectedPlace()
      ]).then(([nextCategories, nextPhrases, nextStrip, nextPlaces, nextPlace]) => {
        if (!alive) return
        setCategories(nextCategories)
        setPhrases(nextPhrases)
        setStrip(nextStrip)
        setPlaces(nextPlaces)
        setSelectedPlace(nextPlace)
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      alive = false
      unsubscribe()
    }
  }, [bank, categoryId])

  useEffect(() => {
    if (composerMode !== 'speak') return
    let alive = true
    const read = () => {
      void bank.typeMatches(draft, selectedPlace?.id).then((next) => {
        if (alive) setTypeMatches(next)
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      alive = false
      unsubscribe()
    }
  }, [bank, composerMode, draft, selectedPlace?.id])

  useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidHide', () => {
      setComposerMode(null)
      setDraft('')
      setTypeMatches([])
    })
    return () => listener.remove()
  }, [])

  const closeComposer = () => {
    Keyboard.dismiss()
    setComposerMode(null)
    setDraft('')
    setTypeMatches([])
  }

  const speakDraft = async () => {
    const text = draft.trim()
    if (!text) return
    let phrase: Phrase | null = null
    try {
      phrase = await bank.saveTypedPhrase(text)
    } catch {
      // Speech still works when the local bank cannot save the sentence.
    }
    await speech.speak(text, phrase?.id)
  }

  const sendPartnerLine = () => {
    const line = draft.trim()
    if (!line) return
    closeComposer()
    void listen.send(line, selectedPlace?.id ?? '')
  }

  const chooseCategory = (id: string) => {
    setCategoryId(id)
    setOffset(layout.wholeMiddleScroll ? headerHeight : 0)
    list.current?.scrollToOffset({ offset: layout.wholeMiddleScroll ? headerHeight : 0, animated: false })
  }

  const choosePlace = () => {
    if (!places.length) {
      router.push('/settings/places')
      return
    }
    ActionSheetIOS.showActionSheetWithOptions(
      { options: [...places.map((place) => place.name), 'Cancel'], cancelButtonIndex: places.length },
      (index) => {
        if (index < places.length) void bank.choosePlace(places[index].id)
      }
    )
  }

  const page = (direction: -1 | 1) => {
    list.current?.scrollToOffset({
      offset: pageOffset(offset, viewportHeight, contentHeight, direction),
      animated: true
    })
  }

  const renderPhrase = ({ item }: { item: Phrase }) => {
    const tone = item.id === 'yes' ? 'yes' : item.id === 'no' ? 'no' : item.id === 'not-sure' ? 'unsure' : null
    const fill = tone ? colors[`${tone}-fill`] : colors.surface
    const edge = tone ? colors[`${tone}-edge`] : colors.edge
    return (
      <View style={{ flex: 1, maxWidth: layout.gridColumns === 2 ? (width - 44) / 2 : undefined }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.text}
          onPress={() => {
            void speech.speak(item.text, item.id)
          }}
          style={({ pressed }) => ({
            flex: 1,
            minHeight: minPhraseHeight,
            borderWidth: tone ? 3 : 2,
            borderColor: edge,
            borderRadius: 12,
            padding: 12,
            backgroundColor: pressed ? colors['surface-pressed'] : fill,
            justifyContent: 'center'
          })}
        >
          <TurnText
            kind={layout.short ? 'headline' : 'title3-emphasized'}
            boldText={boldText}
            style={{ color: colors.ink, paddingRight: 24 }}
          >
            {item.text}
          </TurnText>
          {speaking.activePhraseId === item.id && (
            <SymbolView
              name="speaker.wave.2"
              size={18}
              tintColor={colors.ink}
              accessible={false}
              style={{ position: 'absolute', top: 12, right: 12 }}
            />
          )}
        </Pressable>
      </View>
    )
  }

  const renderStripPhrase = (phrase: Phrase, cardWidth: number) => (
    <View key={phrase.id} style={{ width: cardWidth }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={phrase.text}
        onPress={() => {
          void speech.speak(phrase.text, phrase.id)
        }}
        style={({ pressed }) => ({
          minHeight: 48,
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: colors.edge,
          borderRadius: 12,
          padding: phrase.id === 'somethings-wrong' && layout.stripColumns === 3 ? 4 : 8,
          backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
        })}
      >
        {phrase.id === 'somethings-wrong' && (
          <SymbolView
            name="exclamationmark.triangle"
            size={16}
            tintColor={colors.ink}
            accessible={false}
            style={{
              position: 'absolute',
              left: layout.stripColumns === 3 ? 4 : 8,
              top: layout.stripColumns === 3 ? 4 : 12
            }}
          />
        )}
        <TurnText
          kind="subheadline-emphasized"
          boldText={boldText}
          style={{
            color: colors.ink,
            width: cardWidth - (phrase.id === 'somethings-wrong' && layout.stripColumns === 3 ? 12 : 20),
            paddingTop: phrase.id === 'somethings-wrong' && layout.stripColumns === 3 ? 18 : 0,
            paddingLeft: phrase.id === 'somethings-wrong' && layout.stripColumns === 1 ? 22 : 0
          }}
        >
          {phrase.text}
        </TurnText>
      </Pressable>
    </View>
  )

  const stripContent =
    layout.stripColumns === 1 ? (
      <View style={{ gap: 8 }}>{strip.map((phrase) => renderStripPhrase(phrase, width - 32))}</View>
    ) : (
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {strip.slice(0, 3).map((phrase) => renderStripPhrase(phrase, (width - 48) / 3))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {strip[3] && renderStripPhrase(strip[3], ((width - 48) / 3) * 2 + 8)}
          {strip[4] && renderStripPhrase(strip[4], (width - 48) / 3)}
        </View>
      </View>
    )

  const middleHeader = (
    <View
      onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      style={{ marginHorizontal: !composerOpen && layout.wholeMiddleScroll ? -16 : 0 }}
    >
      {!composerOpen && (
        <View
          style={{
            height: captionHeight,
            marginHorizontal: 16,
            marginTop: 4,
            marginBottom: 4,
            padding: 12,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.edge,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Pressable
            accessibilityRole={listening.active ? 'button' : undefined}
            accessibilityLabel={captionLabel}
            disabled={!listening.active}
            onPress={() => setComposerMode('partner')}
            style={{ flex: 1, minHeight: 44, justifyContent: 'center' }}
          >
            <TurnText
              kind="subheadline"
              boldText={boldText}
              numberOfLines={1}
              style={{ color: colors['ink-secondary'] }}
            >
              {listening.active
                ? listening.answeringLine
                  ? `Still answering: ${listening.answeringLine}`
                  : listening.line
                    ? `They said${listening.rankedOnPhone ? ' · Ranked on this phone' : ''}`
                    : 'Mic off · Typed lines only'
                : 'Caption'}
            </TurnText>
            <TurnText kind="title3" boldText={boldText} numberOfLines={2} style={{ color: colors.ink }}>
              {listening.active ? (listening.line ?? 'Tap here to type what they say.') : 'Listen mode is off.'}
            </TurnText>
          </Pressable>
          {listening.active && listening.row.answers > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear replies"
              onPress={() => listen.clear()}
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
            >
              <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors.ink }}>
                Clear
              </TurnText>
            </Pressable>
          )}
        </View>
      )}
      <View style={{ marginHorizontal: 16, marginBottom: 4 }}>{stripContent}</View>
      <View style={{ marginBottom: 4 }}>
        <ReplyRow
          layout={layout}
          width={width}
          boldText={boldText}
          emptyNote={composerMode === 'speak' ? 'Matching phrases appear here.' : undefined}
          slots={
            composerMode === 'speak'
              ? typeMatches
              : listening.active
                ? shownListening.slots
                : __DEV__ && replyPreview === 1
                  ? [
                      { id: 'yes', text: 'Yes' },
                      { id: 'no', text: 'No' },
                      { id: 'not-sure', text: 'Not sure' },
                      { id: 'dont-know', text: "I don't know" },
                      { id: 'please-wait', text: 'Please wait' },
                      { id: 'help-me', text: 'Help me' }
                    ]
                  : undefined
          }
          bigButton={
            composerMode !== 'speak' && listening.active
              ? shownListening.bigButton
              : !composerOpen && __DEV__ && replyPreview === 2
                ? { id: 'have-something-to-say', text: 'I have something to say' }
                : null
          }
          activePhraseId={speaking.activePhraseId}
          onInteractionChange={(pressed) => setTouchedRow(pressed ? listening : null)}
          onSpeak={(reply) => {
            void speech.speak(reply.text, reply.id)
          }}
        />
      </View>
      {!composerOpen && (
        <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: tabHeight + 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            style={{ flexGrow: 1, height: tabHeight + 8 }}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, paddingVertical: 4, gap: 8 }}
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
                    borderWidth: selected ? 0 : 2,
                    borderColor: colors.edge,
                    backgroundColor: selected ? colors.ink : colors.surface
                  }}
                >
                  <TurnText
                    kind="subheadline-emphasized"
                    boldText={boldText}
                    style={{ color: selected ? colors.surface : colors.ink }}
                  >
                    {category.name}
                  </TurnText>
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
              borderWidth: categoryId === 'all' ? 0 : 2,
              borderColor: colors.edge,
              backgroundColor: categoryId === 'all' ? colors.ink : colors.surface
            }}
          >
            <TurnText
              kind="subheadline-emphasized"
              boldText={boldText}
              style={{ color: categoryId === 'all' ? colors.surface : colors.ink }}
            >
              All
            </TurnText>
          </Pressable>
        </View>
      )}
    </View>
  )

  const bottomControls = [
    { label: 'Type', icon: 'keyboard', action: () => setComposerMode('speak'), disabled: false },
    {
      label: speaking.speaking ? 'Stop' : 'Repeat',
      icon: speaking.speaking ? 'stop.fill' : 'arrow.counterclockwise',
      action: () => {
        void (speaking.speaking ? speech.stop() : speech.repeat())
      },
      disabled: !speaking.speaking && !speaking.lastText
    },
    { label: 'Up', icon: 'chevron.up', action: () => page(-1), disabled: offset <= 0 },
    { label: 'Down', icon: 'chevron.down', action: () => page(1), disabled: offset >= contentHeight - viewportHeight }
  ] as const

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={composerOpen ? 'padding' : undefined}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.board }}>
        <View
          style={{
            minHeight: 52,
            flexDirection: 'row',
            flexWrap: oneControlColumn ? 'wrap' : 'nowrap',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 4
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => router.push('/settings')}
            style={{
              width: 44,
              height: oneControlColumn ? controlHeight : 44,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SymbolView name="gearshape" size={22} tintColor={colors.ink} accessible={false} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Place: ${selectedPlace?.name ?? 'Place'}`}
            onPress={choosePlace}
            style={({ pressed }) => ({
              minHeight: oneControlColumn ? controlHeight : 44,
              minWidth: 44,
              flex: oneControlColumn ? undefined : 1,
              width: oneControlColumn ? width - 84 : undefined,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: colors.edge,
              backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
            })}
          >
            <SymbolView name="mappin.and.ellipse" size={18} tintColor={colors.ink} accessible={false} />
            <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink, flexShrink: 1 }}>
              {selectedPlace?.name ?? 'Place'}
            </TurnText>
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              width: oneControlColumn ? width - 32 : undefined,
              gap: 6,
              alignItems: 'center'
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={listening.active ? 'Mic off. Type partner lines from the caption.' : 'Listen'}
              accessibilityState={{ disabled: listening.active }}
              disabled={listening.active}
              onPress={() => listen.start()}
              style={({ pressed }) => ({
                minHeight: oneControlColumn ? controlHeight : 44,
                minWidth: 44,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                borderRadius: 22,
                borderWidth: 2,
                borderColor: colors.edge,
                backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
              })}
            >
              <SymbolView
                name={listening.active ? 'mic.slash' : 'ear'}
                size={18}
                tintColor={colors.ink}
                accessible={false}
              />
              <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
                {listening.active ? 'Mic off' : 'Listen'}
              </TurnText>
            </Pressable>
            {listening.active && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="End Listen mode"
                onPress={() => {
                  closeComposer()
                  listen.end()
                }}
                style={({ pressed }) => ({
                  minHeight: oneControlColumn ? controlHeight : 44,
                  minWidth: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: colors.edge,
                  backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
                })}
              >
                <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
                  End
                </TurnText>
              </Pressable>
            )}
          </View>
        </View>
        {composerOpen ? (
          <ScrollView
            ref={composerContent}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ paddingBottom: 16 }}
            onLayout={() => composerContent.current?.scrollToEnd({ animated: false })}
            onContentSizeChange={() => composerContent.current?.scrollToEnd({ animated: false })}
          >
            {middleHeader}
          </ScrollView>
        ) : (
          <>
            {!layout.wholeMiddleScroll && middleHeader}
            <FlatList
              key={`${layout.gridColumns}-${layout.wholeMiddleScroll}`}
              ref={list}
              data={phrases}
              keyExtractor={(item) => item.id}
              renderItem={renderPhrase}
              numColumns={layout.gridColumns}
              columnWrapperStyle={layout.gridColumns === 2 ? { gap: 12, alignItems: 'stretch' } : undefined}
              ListHeaderComponent={layout.wholeMiddleScroll ? middleHeader : null}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 12 }}
              onScroll={(event) => setOffset(event.nativeEvent.contentOffset.y)}
              scrollEventThrottle={100}
              onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
              onContentSizeChange={(_, content) => setContentHeight(content)}
              showsVerticalScrollIndicator
              ListFooterComponent={
                __DEV__ ? (
                  <View style={{ alignItems: 'center' }}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setReplyPreview((current) => (current + 1) % 3)}
                      style={{ minHeight: 44, justifyContent: 'center', paddingVertical: 8 }}
                    >
                      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                        Preview row: {['empty', 'six replies', 'big button'][replyPreview]}
                      </TurnText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        void bank.seedDebugPhrases()
                      }}
                      style={{ minHeight: 44, justifyContent: 'center', paddingVertical: 8 }}
                    >
                      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                        Seed 2,000 test phrases
                      </TurnText>
                    </Pressable>
                  </View>
                ) : null
              }
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: twoControlRows ? 'wrap' : 'nowrap',
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderTopWidth: 1,
                borderTopColor: colors.edge
              }}
            >
              {bottomControls.map(({ label, icon, action, disabled }) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onPress={action}
                  style={({ pressed }) => ({
                    flex: twoControlRows ? undefined : 1,
                    width: oneControlColumn ? width - 32 : twoControlRows ? (width - 40) / 2 : undefined,
                    minHeight: controlHeight,
                    minWidth: 44,
                    borderRadius: 22,
                    borderWidth: 2,
                    borderColor: colors.edge,
                    backgroundColor: pressed ? colors['surface-pressed'] : colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: disabled ? 0.45 : 1
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <SymbolView name={icon} size={18} tintColor={colors.ink} accessible={false} />
                    <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
                      {label}
                    </TurnText>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}
        {composerMode === 'speak' && (
          <TypedComposer
            text={draft}
            onChangeText={setDraft}
            onSpeak={() => {
              void speakDraft()
            }}
            onStop={() => {
              void speech.stop()
            }}
            onClose={closeComposer}
            speaking={speaking.speaking}
            boldText={boldText}
            fontScale={fontScale}
          />
        )}
        {composerMode === 'partner' && (
          <PartnerLineComposer
            text={draft}
            onChangeText={setDraft}
            onSend={sendPartnerLine}
            onClose={closeComposer}
            boldText={boldText}
            fontScale={fontScale}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
