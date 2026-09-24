import { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Modal, Pressable, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Place } from '../bank/store'
import { colors, scaledTextStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

type Editor = { id: string | null; name: string }

export default function PlacesScreen() {
  const { ready, boldText, fontScale } = useTurn()
  const bank = ready?.bank
  const [places, setPlaces] = useState<Place[]>([])
  const [selected, setSelected] = useState<Place | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
        <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
          Choose a place from the Home screen. Move places here to change the picker order.
        </TurnText>
        {places.length === 0 && (
          <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
            No places yet. Add one to use the place picker.
          </TurnText>
        )}
        {places.map((place, index) => {
          const canMoveUp = index > 0
          const canMoveDown = index < places.length - 1
          const actions = [
            ...(canMoveUp ? [{ name: 'move-up', label: 'Move up' }] : []),
            ...(canMoveDown ? [{ name: 'move-down', label: 'Move down' }] : []),
            { name: 'rename', label: 'Rename' },
            { name: 'delete', label: 'Delete' }
          ]
          return (
            <View
              key={place.id}
              style={{
                padding: 12,
                gap: 8,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor: colors.edge
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${place.name}${selected?.id === place.id ? ', current place' : ''}. Rename`}
                accessibilityActions={actions}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === 'move-up') move(place.id, -1)
                  if (event.nativeEvent.actionName === 'move-down') move(place.id, 1)
                  if (event.nativeEvent.actionName === 'rename') {
                    setError(null)
                    setEditor({ id: place.id, name: place.name })
                  }
                  if (event.nativeEvent.actionName === 'delete') confirmDelete(place)
                }}
                onPress={() => {
                  setError(null)
                  setEditor({ id: place.id, name: place.name })
                }}
                style={{ minHeight: 44, justifyContent: 'center' }}
              >
                <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
                  {place.name}
                </TurnText>
                {selected?.id === place.id && (
                  <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                    Current place
                  </TurnText>
                )}
              </Pressable>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: 'Move up', disabled: !canMoveUp, action: () => move(place.id, -1) },
                  { label: 'Move down', disabled: !canMoveDown, action: () => move(place.id, 1) },
                  {
                    label: 'Rename',
                    disabled: false,
                    action: () => {
                      setError(null)
                      setEditor({ id: place.id, name: place.name })
                    }
                  },
                  { label: 'Delete', disabled: false, action: () => confirmDelete(place) }
                ].map(({ label, disabled, action }) => (
                  <Pressable
                    key={label}
                    accessibilityRole="button"
                    accessibilityLabel={`${label} ${place.name}`}
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    onPress={action}
                    style={({ pressed }) => ({
                      minHeight: 44,
                      minWidth: 64,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: colors.edge,
                      borderRadius: 22,
                      backgroundColor: pressed ? colors['surface-pressed'] : colors.surface,
                      opacity: disabled ? 0.45 : 1
                    })}
                  >
                    <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors.ink }}>
                      {label}
                    </TurnText>
                  </Pressable>
                ))}
              </View>
            </View>
          )
        })}
        {error && !editor && (
          <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['no-edge'] }}>
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
            backgroundColor: pressed ? colors['accent-pressed'] : colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: places.length >= 12 ? 0.45 : 1
          })}
        >
          <TurnText kind="headline" boldText={boldText} style={{ color: colors['on-accent'] }}>
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
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1, padding: 16, gap: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                onPress={() => {
                  setEditor(null)
                  setError(null)
                }}
                style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}
              >
                <TurnText kind="body" boldText={boldText} style={{ color: colors.accent }}>
                  Cancel
                </TurnText>
              </Pressable>
              <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
                {editor?.id ? 'Rename place' : 'Add place'}
              </TurnText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save place"
                accessibilityState={{ disabled: !editor?.name.trim() || saving }}
                disabled={!editor?.name.trim() || saving}
                onPress={() => void save()}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  opacity: !editor?.name.trim() || saving ? 0.45 : 1
                }}
              >
                <TurnText kind="body" boldText={boldText} style={{ color: colors.accent }}>
                  Save
                </TurnText>
              </Pressable>
            </View>
            <TextInput
              autoFocus
              accessibilityLabel="Place name"
              allowFontScaling={false}
              maxLength={40}
              value={editor?.name ?? ''}
              onChangeText={(name) =>
                setEditor((current) => (current ? { ...current, name: name.slice(0, 40) } : null))
              }
              placeholder="Place name"
              placeholderTextColor={colors['ink-secondary']}
              selectionColor={colors.accent}
              style={{
                ...scaledTextStyle('body', boldText, fontScale),
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
              <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['no-edge'] }}>
                {error}
              </TurnText>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}
