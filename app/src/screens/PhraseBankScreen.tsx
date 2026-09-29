import { useEffect, useRef, useState } from 'react'
import { Alert, Keyboard, Modal, Pressable, ScrollView, TextInput, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import type { Category, Phrase, Place } from '../bank/store'
import { categoryColors, colors, textStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import Button from './Button'
import { categoryHue, categorySymbol, placeSymbol } from './category-style'
import { useShadow } from './depth'
import IconButton from './IconButton'
import { GroupNote, ListGroup, ListRow, ScreenTitle, useScreenTitle } from './ListGroup'
import SheetHeader, { SheetActions, SheetBody } from './SheetHeader'
import PressFill from './PressFill'
import TurnText from './TurnText'

type Editor = {
  id: string | null
  text: string
  categoryId: string
  placeIds: string[]
  isFixed?: boolean
}

const placeTone = { fill: categoryColors['out-and-about'].fill, ink: categoryColors['out-and-about'].edge }

export default function PhraseBankScreen() {
  const navigation = useNavigation()
  const { fontScale } = useWindowDimensions()
  const cardShadow = useShadow('card')
  const undoShadow = useShadow('raised')
  const { ready, boldText } = useTurn()
  const bank = ready?.bank
  const { category: categoryParam, editPhraseId } = useLocalSearchParams<{
    category: string
    editPhraseId?: string
  }>()
  const categoryId = categoryParam ?? 'quick'
  const isStrip = categoryId === 'strip'

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [placeMap, setPlaceMap] = useState<Record<string, string[]>>({})
  const [editMode, setEditMode] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [picker, setPicker] = useState<'category' | 'places' | null>(null)
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [hasUndo, setHasUndo] = useState(false)
  const title = categoryName || (isStrip ? 'Conversation strip' : 'Phrases')
  const { onTitleLayout, scrollProps } = useScreenTitle(title)

  const handledInitialEdit = useRef(false)

  // Commit staged deletions on leaving the screen
  useEffect(() => {
    return () => {
      void bank?.commitDeletes()
    }
  }, [bank])

  useEffect(() => {
    return () => {
      void bank?.reviewCategory(categoryId)
    }
  }, [bank, categoryId])

  useEffect(() => {
    if (!bank) return
    let active = true

    const read = async () => {
      try {
        const [nextCategories, nextPhrases, nextPlaces] = await Promise.all([
          bank.categories(),
          bank.phrases(categoryId),
          bank.places()
        ])
        if (!active) return

        setCategories(nextCategories)
        setPhrases(nextPhrases)
        setPlaces(nextPlaces)
        setHasUndo(bank.hasStagedDeletes())

        if (isStrip) {
          setCategoryName('Conversation strip')
        } else {
          const current = nextCategories.find((c) => c.id === categoryId)
          setCategoryName(current?.name ?? 'Phrases')
        }

        // Fetch place associations for each phrase
        const placeEntries = await Promise.all(
          nextPhrases.map(async (p) => {
            const pPlaces = await bank.phrasePlaces(p.id)
            return [p.id, pPlaces] as const
          })
        )
        if (!active) return
        setPlaceMap(Object.fromEntries(placeEntries))

        // Open editor if editPhraseId was passed as param
        if (editPhraseId && !handledInitialEdit.current) {
          const target = nextPhrases.find((p) => p.id === editPhraseId)
          if (target) {
            handledInitialEdit.current = true
            const initialPlaces = await bank.phrasePlaces(target.id)
            if (active) {
              setEditor({
                id: target.id,
                text: target.text,
                categoryId: target.category_id,
                placeIds: initialPlaces,
                isFixed: target.fixed === 1
              })
            }
          }
        }
      } catch (cause) {
        if (active) setError(String(cause))
      }
    }

    void read()
    const unsubscribe = bank.subscribe(() => {
      void read()
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [bank, categoryId, editPhraseId, isStrip])

  // Configure navigation header
  useEffect(() => {
    const openAdd = () => {
      setError(null)
      setEditor({ id: null, text: '', categoryId, placeIds: [] })
    }
    navigation.setOptions({
      title: categoryName || (isStrip ? 'Conversation strip' : 'Phrases'),
      // Native bar buttons, like the back button beside them: iOS keeps them at bar size and shows them in the Large
      // Content Viewer at accessibility sizes, where a React view in the bar grew past the title.
      unstable_headerRightItems: isStrip
        ? undefined
        : () =>
            editMode
              ? [
                  {
                    type: 'button',
                    label: 'Done',
                    variant: 'prominent',
                    tintColor: colors.accent,
                    onPress: () => setEditMode(false)
                  }
                ]
              : [
                  {
                    type: 'button',
                    label: 'Edit',
                    accessibilityLabel: 'Edit',
                    icon: { type: 'sfSymbol', name: 'arrow.up.arrow.down' },
                    tintColor: colors.ink,
                    onPress: () => setEditMode(true)
                  },
                  {
                    type: 'button',
                    label: 'Add phrase',
                    accessibilityLabel: 'Add phrase',
                    icon: { type: 'sfSymbol', name: 'plus' },
                    variant: 'prominent',
                    tintColor: colors.accent,
                    onPress: openAdd
                  }
                ]
    })
  }, [navigation, categoryName, isStrip, editMode, categoryId])

  const move = (id: string, direction: -1 | 1) => {
    if (!bank) return
    void bank.movePhrase(id, direction).catch((cause) => setError(String(cause)))
  }

  const deletePhrase = (id: string) => {
    if (!bank) return
    void bank.deletePhrase(id).catch((cause) => setError(String(cause)))
  }

  // A deleted phrase can come back with Undo until the user leaves the editor (BANK-9). Edit mode's Delete acts at
  // once, as its Undo bar follows; the sheet's Delete asks first, as frames 47 and 48 have it.
  const confirmDelete = (phrase: { id: string; text: string }, then?: () => void) => {
    Alert.alert(`Delete “${phrase.text}”?`, 'It leaves your phrase bank and the grid. You can undo right after.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          then?.()
          deletePhrase(phrase.id)
        }
      }
    ])
  }

  const openEdit = async (phrase: Phrase) => {
    if (!bank) return
    setError(null)
    const pPlaces = placeMap[phrase.id] ?? (await bank.phrasePlaces(phrase.id))
    setEditor({
      id: phrase.id,
      text: phrase.text,
      categoryId: phrase.category_id,
      placeIds: pPlaces,
      isFixed: phrase.fixed === 1
    })
  }

  const closeEditor = () => {
    setEditor(null)
    setPicker(null)
    setError(null)
  }

  const save = async () => {
    if (!bank || !editor || saving) return
    setSaving(true)
    setError(null)
    try {
      if (editor.id) {
        await bank.editPhrase(editor.id, {
          text: editor.text,
          categoryId: editor.categoryId,
          placeIds: editor.placeIds
        })
      } else {
        await bank.addPhrase(editor.categoryId, editor.text, editor.placeIds)
      }
      setEditor(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setSaving(false)
    }
  }

  const placeNameMap = new Map(places.map((p) => [p.id, p.name]))
  const ids = categories.map((category) => category.id)
  const hue = categoryHue(categoryId, ids)
  const glyph = Math.round(18 * Math.min(fontScale, 1.6))

  if (!bank) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board, padding: 16 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          Loading phrases…
        </TurnText>
      </SafeAreaView>
    )
  }

  const editorCategory = categories.find((c) => c.id === editor?.categoryId)
  const editorPlaces = (editor?.placeIds ?? []).map((id) => placeNameMap.get(id)).filter(Boolean)
  const editorPhrase = phrases.find((p) => p.id === editor?.id)
  const editorCanDelete = !!editorPhrase && !isStrip && editorPhrase.fixed !== 1

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        {...scrollProps}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 10 }}
      >
        <View style={{ marginBottom: 6 }}>
          <ScreenTitle title={title} boldText={boldText} onLayout={onTitleLayout} />
        </View>
        {phrases.length === 0 && (
          <TurnText kind="body" boldText={boldText} style={{ color: colors.ink, marginHorizontal: 4 }}>
            No phrases in this category yet.
          </TurnText>
        )}

        {phrases.map((phrase, index) => {
          const canMoveUp = editMode && !isStrip && index > 0
          const canMoveDown = editMode && !isStrip && index < phrases.length - 1
          const canDelete = !isStrip && phrase.fixed !== 1

          const phrasePlacesList = (placeMap[phrase.id] ?? []).map((pId) => placeNameMap.get(pId)).filter(Boolean)
          const placesText = phrasePlacesList.join(', ')
          const phraseDetails = [placesText, phrase.reviewed === 0 ? 'Starter' : null].filter(Boolean).join(', ')

          const actions = [
            { name: 'edit', label: 'Edit' },
            ...(!isStrip && index > 0 ? [{ name: 'move-up', label: 'Move up' }] : []),
            ...(!isStrip && index < phrases.length - 1 ? [{ name: 'move-down', label: 'Move down' }] : []),
            ...(canDelete ? [{ name: 'delete', label: 'Delete' }] : [])
          ]

          return (
            <View key={phrase.id} style={{ borderRadius: 20, boxShadow: cardShadow }}>
              <View
                style={{
                  borderRadius: 20,
                  borderCurve: 'continuous',
                  borderWidth: 1.5,
                  borderColor: hue.edge,
                  backgroundColor: colors.surface,
                  overflow: 'hidden'
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={phrase.text}
                  accessibilityValue={phraseDetails ? { text: phraseDetails } : undefined}
                  accessibilityHint="Opens the phrase to edit it."
                  accessibilityActions={actions}
                  onAccessibilityAction={(event) => {
                    if (event.nativeEvent.actionName === 'edit') void openEdit(phrase)
                    if (event.nativeEvent.actionName === 'move-up') move(phrase.id, -1)
                    if (event.nativeEvent.actionName === 'move-down') move(phrase.id, 1)
                    if (event.nativeEvent.actionName === 'delete') deletePhrase(phrase.id)
                  }}
                  onPress={() => void openEdit(phrase)}
                  style={{
                    minHeight: 61,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingLeft: 16,
                    paddingRight: editMode ? 16 : 8,
                    paddingVertical: 9.5
                  }}
                >
                  {({ pressed }) => (
                    <>
                      <PressFill pressed={pressed} color={colors['surface-pressed']} />
                      <View style={{ flex: 1, gap: 2 }}>
                        <TurnText kind="phrase" boldText={boldText} style={{ color: colors.ink }}>
                          {phrase.text}
                        </TurnText>
                        {(phrase.reviewed === 0 || !!placesText) && (
                          <View
                            style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              columnGap: 10,
                              rowGap: 2
                            }}
                          >
                            {phrase.reviewed === 0 && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <SymbolView
                                  name="text.book.closed"
                                  size={Math.round(12 * Math.min(fontScale, 2.6))}
                                  weight="semibold"
                                  tintColor={colors['ink-secondary']}
                                  accessible={false}
                                />
                                <TurnText kind="caption" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                                  Starter
                                </TurnText>
                              </View>
                            )}
                            {placesText ? (
                              <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                                {placesText}
                              </TurnText>
                            ) : null}
                          </View>
                        )}
                      </View>
                      {!editMode && (
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors['surface-sunken']
                          }}
                        >
                          <SymbolView
                            name="pencil"
                            size={glyph}
                            weight="semibold"
                            tintColor={colors.ink}
                            accessible={false}
                          />
                        </View>
                      )}
                    </>
                  )}
                </Pressable>

                {/* Edit mode's buttons sit under the phrase, one tap each, never a drag (A11Y-5, A11Y-8). */}
                {editMode && !isStrip && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 10,
                      paddingHorizontal: 16,
                      paddingBottom: 12
                    }}
                  >
                    <IconButton
                      symbol="chevron.up"
                      label="Move up"
                      disabled={!canMoveUp}
                      onPress={() => move(phrase.id, -1)}
                    />
                    <IconButton
                      symbol="chevron.down"
                      label="Move down"
                      disabled={!canMoveDown}
                      onPress={() => move(phrase.id, 1)}
                    />
                    <IconButton symbol="pencil" label="Edit" onPress={() => void openEdit(phrase)} />
                    {canDelete && (
                      <IconButton
                        symbol="trash"
                        label="Delete"
                        tint={colors['no-edge']}
                        onPress={() => deletePhrase(phrase.id)}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          )
        })}

        {error && !editor && <GroupNote boldText={boldText}>{error}</GroupNote>}
      </ScrollView>

      {/* The Undo bar stays at the bottom while any deletion is staged, with no timer (BANK-9, A11Y-5). It sits under
          the list rather than over it, and from AX1 Undo wraps to its own line, so nothing goes out of reach. */}
      {hasUndo && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            minHeight: 60,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            columnGap: 12,
            rowGap: 8,
            paddingLeft: 20,
            paddingRight: 8,
            paddingVertical: 8,
            borderRadius: 30,
            borderCurve: 'continuous',
            backgroundColor: colors.ink,
            boxShadow: undoShadow
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
            <SymbolView name="trash" size={glyph} weight="semibold" tintColor={colors.surface} accessible={false} />
            <TurnText kind="headline" boldText={boldText} style={{ flexShrink: 1, color: colors.surface }}>
              Phrase deleted
            </TurnText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Undo"
            onPress={() => {
              void bank.undoDelete().catch((cause) => setError(String(cause)))
            }}
            style={{
              minHeight: 44,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 16,
              borderRadius: 22,
              backgroundColor: colors.surface
            }}
          >
            {({ pressed }) => (
              <>
                <PressFill pressed={pressed} color={colors['surface-pressed']} radius={22} />
                <SymbolView
                  name="arrow.uturn.backward"
                  size={glyph}
                  weight="semibold"
                  tintColor={colors.ink}
                  accessible={false}
                />
                <TurnText kind="button" boldText={boldText} style={{ color: colors.ink }}>
                  Undo
                </TurnText>
              </>
            )}
          </Pressable>
        </View>
      )}

      {/* Add or Edit phrase sheet */}
      <Modal
        visible={!!editor}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={picker ? () => setPicker(null) : closeEditor}
      >
        <SheetBody>
          {/* The form stays mounted while a chooser takes the sheet's place, so its words survive the trip. */}
          <View style={{ flex: 1, display: picker ? 'none' : 'flex' }}>
            <SheetHeader title={editor?.id ? 'Edit phrase' : 'Add phrase'} boldText={boldText} onClose={closeEditor} />
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16, gap: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ gap: 8 }}>
                <TurnText
                  kind="label"
                  boldText={boldText}
                  style={{ color: colors['ink-secondary'], marginHorizontal: 4 }}
                >
                  Phrase
                </TurnText>
                <TextInput
                  autoFocus
                  accessibilityLabel="Phrase"
                  accessibilityHint="Type the phrase you want to say, up to 200 characters."
                  maxLength={200}
                  multiline
                  editable={!editor?.isFixed}
                  value={editor?.text ?? ''}
                  onChangeText={(text) =>
                    setEditor((current) => (current ? { ...current, text: text.slice(0, 200) } : null))
                  }
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  selectionColor={colors.accent}
                  scrollEnabled
                  style={{
                    ...textStyle('body', boldText),
                    minHeight: 56,
                    maxHeight: 180,
                    paddingHorizontal: 18,
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderWidth: focused ? 2.5 : 1.5,
                    borderColor: focused ? colors.accent : colors.edge,
                    borderRadius: 24,
                    borderCurve: 'continuous',
                    color: colors.ink,
                    backgroundColor: colors.surface,
                    textAlignVertical: 'top'
                  }}
                />
                {!!editor && editor.text.length >= 180 && (
                  <TurnText
                    kind="footnote"
                    boldText={boldText}
                    style={{ color: colors['ink-secondary'], marginHorizontal: 4 }}
                  >
                    {200 - editor.text.length} characters left
                  </TurnText>
                )}
                {editor?.isFixed && (
                  <TurnText
                    kind="footnote"
                    boldText={boldText}
                    style={{ color: colors['ink-secondary'], marginHorizontal: 4 }}
                  >
                    Yes, No, and Not sure cannot be renamed.
                  </TurnText>
                )}
              </View>

              {((!editor?.isFixed && !isStrip) || places.length > 0) && (
                <ListGroup>
                  {!editor?.isFixed && !isStrip && editorCategory ? (
                    <ListRow
                      label="Category"
                      boldText={boldText}
                      symbol={categorySymbol(editorCategory.id)}
                      tone={{
                        fill: categoryHue(editorCategory.id, ids).fill,
                        ink: categoryHue(editorCategory.id, ids).edge
                      }}
                      value={editorCategory.name}
                      accessibilityLabel="Category"
                      accessibilityValue={editorCategory.name}
                      chevron
                      onPress={() => {
                        Keyboard.dismiss()
                        setPicker('category')
                      }}
                    />
                  ) : null}
                  {places.length > 0 ? (
                    <ListRow
                      label="Places"
                      boldText={boldText}
                      symbol="mappin.and.ellipse"
                      tone={placeTone}
                      value={editorPlaces.length > 0 ? editorPlaces.join(', ') : 'Any place'}
                      accessibilityLabel="Places"
                      accessibilityValue={editorPlaces.length > 0 ? editorPlaces.join(', ') : 'Any place'}
                      chevron
                      onPress={() => {
                        Keyboard.dismiss()
                        setPicker('places')
                      }}
                    />
                  ) : null}
                </ListGroup>
              )}

              {error && (
                <TurnText
                  kind="footnote"
                  boldText={boldText}
                  style={{ color: colors['ink-secondary'], marginHorizontal: 4 }}
                >
                  {error}
                </TurnText>
              )}
            </ScrollView>
            <SheetActions>
              {editorCanDelete && editorPhrase ? (
                <Button
                  variant="destructive"
                  label="Delete"
                  boldText={boldText}
                  onPress={() => confirmDelete(editorPhrase, closeEditor)}
                />
              ) : null}
              <Button
                variant="primary"
                label="Save"
                boldText={boldText}
                disabled={!editor?.text.trim() || saving}
                onPress={() => void save()}
              />
            </SheetActions>
          </View>

          {/* The category and places choosers take the phrase sheet's place, as frames 51 and 52 draw them, rather
              than a second sheet on top, whose dismissal would swallow the next tap. */}
          {picker && (
            <View style={{ flex: 1 }}>
              <SheetHeader
                title={picker === 'category' ? 'Category' : 'Places'}
                boldText={boldText}
                closeLabel="Close"
                onClose={() => setPicker(null)}
              />
              <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
                <ListGroup>
                  {picker === 'category'
                    ? categories.map((category) => {
                        const tone = categoryHue(category.id, ids)
                        return (
                          <ListRow
                            key={category.id}
                            label={category.name}
                            boldText={boldText}
                            symbol={categorySymbol(category.id)}
                            tone={{ fill: tone.fill, ink: tone.edge }}
                            checked={editor?.categoryId === category.id}
                            onPress={() => {
                              setEditor((current) => (current ? { ...current, categoryId: category.id } : null))
                              setPicker(null)
                            }}
                          />
                        )
                      })
                    : places.map((place) => {
                        const on = editor?.placeIds.includes(place.id) ?? false
                        return (
                          <ListRow
                            key={place.id}
                            label={place.name}
                            boldText={boldText}
                            symbol={placeSymbol(place.id)}
                            tone={placeTone}
                            checked={on}
                            onPress={() =>
                              setEditor((current) => {
                                if (!current) return null
                                const nextPlaces = on
                                  ? current.placeIds.filter((p) => p !== place.id)
                                  : [...current.placeIds, place.id]
                                return { ...current, placeIds: nextPlaces }
                              })
                            }
                          />
                        )
                      })}
                </ListGroup>
                {picker === 'places' && (
                  <GroupNote boldText={boldText}>At these places, the row offers this phrase first.</GroupNote>
                )}
              </ScrollView>
              {picker === 'places' && (
                <SheetActions>
                  <Button variant="primary" label="Done" boldText={boldText} onPress={() => setPicker(null)} />
                </SheetActions>
              )}
            </View>
          )}
        </SheetBody>
      </Modal>
    </SafeAreaView>
  )
}
