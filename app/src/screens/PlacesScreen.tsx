import { useEffect, useState } from 'react'
import { SymbolView } from 'expo-symbols'
import {
  ActionSheetIOS,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Place } from '../bank/store'
import { colors, textStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import SheetHeader from './SheetHeader'
import TurnText from './TurnText'

type Editor = { id: string | null; name: string }

export default function PlacesScreen() {
  const { ready, boldText } = useTurn()
  const bank = ready?.bank
  const [places, setPlaces] = useState<Place[]>([])
  const [selected, setSelected] = useState<Place | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { fontScale } = useWindowDimensions()

  useEffect(() => {
    if (!bank) return
    let active = true
    const read = () => {
      void Promise.all([bank.places(), bank.selectedPlace()]).then(([nextPlaces, nextSelected]) => {
        if (!active) return
        setPlaces(nextPlaces)
        setSelected(nextSelected)
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      active = false
      unsubscribe()
    }
  }, [bank])

  const move = (id: string, direction: -1 | 1) => {
    if (!bank) return
    void bank.movePlace(id, direction).catch((cause) => setError(String(cause)))
  }

  const confirmDelete = (place: Place) => {
    if (!bank) return
    Alert.alert(`Delete ${place.name}?`, 'Phrases linked to this place will no longer use it.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void bank.deletePlace(place.id).catch((cause) => setError(String(cause)))
        }
      }
    ])
  }

  // Move, Rename, and Delete sit one tap away, in iOS's own action sheet, and stay named accessibility actions (A11Y-8).
  const placeActions = (index: number) => [
    ...(index > 0 ? [{ name: 'move-up', label: 'Move up' }] : []),
    ...(index < places.length - 1 ? [{ name: 'move-down', label: 'Move down' }] : []),
    { name: 'rename', label: 'Rename' },
    { name: 'delete', label: 'Delete' }
  ]

  const run = (place: Place, action: string) => {
    if (action === 'move-up') move(place.id, -1)
    if (action === 'move-down') move(place.id, 1)
    if (action === 'rename') {
      setError(null)
      setEditor({ id: place.id, name: place.name })
    }
    if (action === 'delete') confirmDelete(place)
  }

  const showActions = (place: Place, index: number) => {
    const actions = placeActions(index)
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: place.name,
        options: [...actions.map(({ label }) => label), 'Cancel'],
        destructiveButtonIndex: actions.length - 1,
        cancelButtonIndex: actions.length
      },
      (chosen) => {
        if (chosen < actions.length) run(place, actions[chosen].name)
      }
    )
  }

  const save = async () => {
    if (!bank || !editor || saving) return
    setSaving(true)
    setError(null)
    try {
      if (editor.id) await bank.renamePlace(editor.id, editor.name)
      else await bank.addPlace(editor.name)
      setEditor(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setSaving(false)
    }
  }

  if (!bank) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board, padding: 16 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          Loading places…
        </TurnText>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12 }}>
        {places.length === 0 ? (
          <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
            No places yet. Add one to use the place picker.
          </TurnText>
        ) : (
          <View style={{ borderRadius: 12, backgroundColor: colors.surface, overflow: 'hidden' }}>
            {places.map((place, index) => {
              const current = selected?.id === place.id
              return (
                <Pressable
                  key={place.id}
                  accessibilityRole="button"
                  // Named explicitly: left to iOS, the trailing symbol adds its own name.
                  accessibilityLabel={current ? `${place.name}, Current place` : place.name}
                  accessibilityHint="Shows Move, Rename, and Delete."
                  accessibilityActions={placeActions(index)}
                  onAccessibilityAction={(event) => run(place, event.nativeEvent.actionName)}
                  onPress={() => showActions(place, index)}
                  style={({ pressed }) => ({
                    minHeight: 52,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
                  })}
                >
                  {index > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 16,
                        right: 0,
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: colors.edge
                      }}
                    />
                  )}
                  <View style={{ flex: 1, gap: 2 }}>
                    <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
                      {place.name}
                    </TurnText>
                    {current && (
                      <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                        Current place
                      </TurnText>
                    )}
                  </View>
                  <SymbolView
                    name="ellipsis.circle"
                    size={Math.round(22 * Math.min(fontScale, 2.6))}
                    tintColor={colors.accent}
                    accessible={false}
                  />
                </Pressable>
              )
            })}
          </View>
        )}
        <TurnText
          kind="subheadline"
          boldText={boldText}
          style={{ color: colors['ink-secondary'], marginHorizontal: 16 }}
        >
          Choose a place from the Home screen. Move places here to change the picker order.
        </TurnText>
        {error && !editor && (
          <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            {error}
          </TurnText>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add place"
          accessibilityState={{ disabled: places.length >= 12 }}
          disabled={places.length >= 12}
          onPress={() => {
            setError(null)
            setEditor({ id: null, name: '' })
          }}
          style={({ pressed }) => ({
            minHeight: 52,
            borderRadius: 26,
            backgroundColor: places.length >= 12 ? colors.surface : pressed ? colors['accent-pressed'] : colors.accent,
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          <TurnText
            kind="headline"
            boldText={boldText}
            style={{ color: places.length >= 12 ? colors['ink-secondary'] : colors['on-accent'] }}
          >
            Add place
          </TurnText>
        </Pressable>
        {places.length >= 12 && (
          <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            You can have up to 12 places.
          </TurnText>
        )}
      </ScrollView>

      <Modal
        visible={!!editor}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setEditor(null)
          setError(null)
        }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.board }}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1, padding: 16 }}>
            <SheetHeader
              title={editor?.id ? 'Rename place' : 'Add place'}
              boldText={boldText}
              canSave={!!editor?.name.trim() && !saving}
              onCancel={() => {
                setEditor(null)
                setError(null)
              }}
              onSave={() => void save()}
            />
            <View style={{ gap: 20 }}>
              <TextInput
                autoFocus
                accessibilityLabel="Place name"
                maxLength={40}
                value={editor?.name ?? ''}
                onChangeText={(name) =>
                  setEditor((current) => (current ? { ...current, name: name.slice(0, 40) } : null))
                }
                placeholder="Place name"
                placeholderTextColor={colors['ink-secondary']}
                selectionColor={colors.accent}
                style={{
                  ...textStyle('body', boldText),
                  minHeight: 52,
                  padding: 12,
                  borderWidth: 2,
                  borderColor: colors.edge,
                  borderRadius: 12,
                  color: colors.ink,
                  backgroundColor: colors.surface
                }}
              />
              {!!editor && editor.name.length >= 35 && (
                <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                  {40 - editor.name.length} characters left
                </TurnText>
              )}
              {error && (
                <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                  {error}
                </TurnText>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}
