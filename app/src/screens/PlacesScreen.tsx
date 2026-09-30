import { useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Modal, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Place } from '../bank/store'
import { categoryColors, colors, textStyle } from '../constants/theme'
import { useCompanion, useTurn } from '../turn-context'
import Button from './Button'
import { placeSymbol } from './category-style'
import { GroupNote, ListGroup, ListRow, ScreenTitle, useScreenTitle } from './ListGroup'
import SheetHeader, { SheetActions, SheetBody } from './SheetHeader'
import TurnText from './TurnText'

// showFace is the sheet's Show the face here, saved with the place (frames 40 and 41).
type Editor = { id: string | null; name: string; showFace: boolean }

// Places wear Out and about's hue, the category of being somewhere (DESIGN, buttons and lists).
const placeTone = { fill: categoryColors['out-and-about'].fill, ink: categoryColors['out-and-about'].edge }

export default function PlacesScreen() {
  const navigation = useNavigation()
  const { ready, boldText } = useTurn()
  const { state: companion } = useCompanion()
  const bank = ready?.bank
  const [places, setPlaces] = useState<Place[]>([])
  const [selected, setSelected] = useState<Place | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { onTitleLayout, scrollProps } = useScreenTitle('Places')
  const atLimit = places.length >= 12

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

  useEffect(() => {
    navigation.setOptions({
      // A native bar button, like the back button beside it, so iOS keeps it at bar size at every text size.
      unstable_headerRightItems: () => [
        {
          type: 'button',
          label: 'Add place',
          accessibilityLabel: 'Add place',
          icon: { type: 'sfSymbol', name: 'plus' },
          variant: 'prominent',
          tintColor: colors.accent,
          disabled: !bank || atLimit,
          onPress: () => {
            setError(null)
            setEditor({ id: null, name: '', showFace: true })
          }
        }
      ]
    })
  }, [navigation, bank, atLimit])

  const close = () => {
    setEditor(null)
    setError(null)
  }

  const editing = editor?.id ? places.findIndex((place) => place.id === editor.id) : -1

  const move = (direction: -1 | 1) => {
    if (!bank || !editor?.id) return
    void bank.movePlace(editor.id, direction).catch((cause) => setError(String(cause)))
  }

  const confirmDelete = () => {
    const place = places[editing]
    if (!bank || !place) return
    Alert.alert(`Delete ${place.name}?`, `Your phrases stay in the bank. They just stop being tied to ${place.name}.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          close()
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
      const id = editor.id ?? (await bank.addPlace(editor.name)).id
      await bank.showCompanionAt(id, editor.showFace)
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
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        {...scrollProps}
        style={{ flex: 1, backgroundColor: colors.board }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
      >
        <View style={{ marginBottom: 16 }}>
          <ScreenTitle title="Places" boldText={boldText} onLayout={onTitleLayout} />
        </View>
        {places.length === 0 ? (
          <TurnText kind="body" boldText={boldText} style={{ color: colors.ink, marginHorizontal: 16 }}>
            No places yet. Add one to use the place picker.
          </TurnText>
        ) : (
          <ListGroup>
            {places.map((place) => (
              <ListRow
                key={place.id}
                label={place.name}
                boldText={boldText}
                symbol={placeSymbol(place.id)}
                tone={placeTone}
                subtitle={selected?.id === place.id ? 'Current place' : undefined}
                accessibilityLabel={place.name}
                accessibilityValue={selected?.id === place.id ? 'Current place' : undefined}
                accessibilityHint="Shows Rename, Move, and Delete."
                chevron
                onPress={() => {
                  setError(null)
                  setEditor({ id: place.id, name: place.name, showFace: place.show_companion !== 0 })
                }}
              />
            ))}
          </ListGroup>
        )}
        <GroupNote boldText={boldText}>Pick a place on Home with one tap. Turn never reads your location.</GroupNote>
        {atLimit && <GroupNote boldText={boldText}>You can have up to 12 places.</GroupNote>}
        {error && !editor && <GroupNote boldText={boldText}>{error}</GroupNote>}
      </ScrollView>
      <Modal visible={!!editor} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
        <SheetBody>
          <SheetHeader title={editor?.id ? 'Edit place' : 'Add place'} boldText={boldText} onClose={close} />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              autoFocus
              accessibilityLabel="Place name"
              maxLength={40}
              value={editor?.name ?? ''}
              onChangeText={(name) =>
                setEditor((current) => (current ? { ...current, name: name.slice(0, 40) } : null))
              }
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Place name"
              placeholderTextColor={colors['ink-secondary']}
              selectionColor={colors.accent}
              style={{
                ...textStyle('body', boldText),
                minHeight: 56,
                paddingHorizontal: 18,
                paddingVertical: 14,
                borderWidth: focused ? 2.5 : 1.5,
                borderColor: focused ? colors.accent : colors.edge,
                borderRadius: 24,
                borderCurve: 'continuous',
                color: colors.ink,
                backgroundColor: colors.surface
              }}
            />
            {!!editor && editor.name.length >= 35 && (
              <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                {40 - editor.name.length} characters left
              </TurnText>
            )}
            {/* Only while a companion is chosen: with none, there's no face to hide. */}
            {companion.model && (
              <ListGroup>
                <ListRow
                  label="Show the face here"
                  boldText={boldText}
                  symbol="mappin.and.ellipse"
                  subtitle="Off hides it at this place only"
                  toggle={{
                    value: editor?.showFace ?? true,
                    onValueChange: (showFace) => setEditor((current) => (current ? { ...current, showFace } : null))
                  }}
                />
              </ListGroup>
            )}
            {error && (
              <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                {error}
              </TurnText>
            )}
            {/* The picker's order, one tap a step (A11Y-5). */}
            {editing >= 0 && places.length > 1 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {editing > 0 && (
                  <Button
                    label="Move up"
                    symbol="chevron.up"
                    boldText={boldText}
                    onPress={() => move(-1)}
                    style={{ flexGrow: 1 }}
                  />
                )}
                {editing < places.length - 1 && (
                  <Button
                    label="Move down"
                    symbol="chevron.down"
                    boldText={boldText}
                    onPress={() => move(1)}
                    style={{ flexGrow: 1 }}
                  />
                )}
              </View>
            )}
          </ScrollView>
          <SheetActions>
            {editor?.id ? <Button label="Delete" boldText={boldText} onPress={confirmDelete} /> : null}
            <Button
              variant="primary"
              label="Save"
              boldText={boldText}
              disabled={!editor?.name.trim() || saving}
              onPress={() => void save()}
            />
          </SheetActions>
        </SheetBody>
      </Modal>
    </>
  )
}
