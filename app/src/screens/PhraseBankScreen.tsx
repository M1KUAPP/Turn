import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import type { Category, Phrase, Place } from '../bank/store'
import { colors, textStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import SheetHeader from './SheetHeader'
import TurnText from './TurnText'

type Editor = {
  id: string | null
  text: string
  categoryId: string
  placeIds: string[]
  isFixed?: boolean
}

export default function PhraseBankScreen() {
  const navigation = useNavigation()
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
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [hasUndo, setHasUndo] = useState(false)

  const handledInitialEdit = useRef(false)

  // Commit staged deletions on leaving the screen
  useEffect(() => {
    return () => {
      void bank?.commitDeletes()
    }
  }, [bank])

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
    navigation.setOptions({
      title: categoryName || (isStrip ? 'Conversation strip' : 'Phrases'),
      headerRight: isStrip
        ? undefined
        : () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={editMode ? 'Done' : 'Edit'}
              onPress={() => setEditMode((prev) => !prev)}
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'flex-end' }}
            >
              <TurnText kind="headline" boldText={boldText} style={{ color: colors.accent }}>
                {editMode ? 'Done' : 'Edit'}
              </TurnText>
            </Pressable>
          )
    })
  }, [navigation, categoryName, isStrip, editMode, boldText])

  const move = (id: string, direction: -1 | 1) => {
    if (!bank) return
    void bank.movePhrase(id, direction).catch((cause) => setError(String(cause)))
  }

  const deletePhrase = (id: string) => {
    if (!bank) return
    void bank.deletePhrase(id).catch((cause) => setError(String(cause)))
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

  if (!bank) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board, padding: 16 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          Loading phrases…
        </TurnText>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80, gap: 12 }}>
        {phrases.length === 0 && (
          <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
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
            <View
              key={phrase.id}
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
                accessibilityLabel={phrase.text}
                accessibilityValue={phraseDetails ? { text: phraseDetails } : undefined}
                accessibilityActions={actions}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === 'edit') void openEdit(phrase)
                  if (event.nativeEvent.actionName === 'move-up') move(phrase.id, -1)
                  if (event.nativeEvent.actionName === 'move-down') move(phrase.id, 1)
                  if (event.nativeEvent.actionName === 'delete') deletePhrase(phrase.id)
                }}
                onPress={() => void openEdit(phrase)}
                style={{ minHeight: 44, justifyContent: 'center', gap: 4 }}
              >
                <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
                  {phrase.text}
                </TurnText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {placesText ? (
                    <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                      {placesText}
                    </TurnText>
                  ) : null}
                  {phrase.reviewed === 0 && (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        backgroundColor: colors.board,
                        borderWidth: 1,
                        borderColor: colors.edge
                      }}
                    >
                      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                        Starter
                      </TurnText>
                    </View>
                  )}
                </View>
              </Pressable>

              {editMode && !isStrip && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Move up"
                    accessibilityState={{ disabled: !canMoveUp }}
                    disabled={!canMoveUp}
                    onPress={() => move(phrase.id, -1)}
                    style={({ pressed }) => ({
                      minHeight: 44,
                      minWidth: 64,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: colors.edge,
                      borderRadius: 22,
                      backgroundColor: canMoveUp && pressed ? colors['surface-pressed'] : colors.surface
                    })}
                  >
                    <TurnText
                      kind="subheadline-emphasized"
                      boldText={boldText}
                      style={{ color: canMoveUp ? colors.ink : colors['ink-secondary'] }}
                    >
                      Move up
                    </TurnText>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Move down"
                    accessibilityState={{ disabled: !canMoveDown }}
                    disabled={!canMoveDown}
                    onPress={() => move(phrase.id, 1)}
                    style={({ pressed }) => ({
                      minHeight: 44,
                      minWidth: 64,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: colors.edge,
                      borderRadius: 22,
                      backgroundColor: canMoveDown && pressed ? colors['surface-pressed'] : colors.surface
                    })}
                  >
                    <TurnText
                      kind="subheadline-emphasized"
                      boldText={boldText}
                      style={{ color: canMoveDown ? colors.ink : colors['ink-secondary'] }}
                    >
                      Move down
                    </TurnText>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit"
                    onPress={() => void openEdit(phrase)}
                    style={({ pressed }) => ({
                      minHeight: 44,
                      minWidth: 64,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: colors.edge,
                      borderRadius: 22,
                      backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
                    })}
                  >
                    <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors.ink }}>
                      Edit
                    </TurnText>
                  </Pressable>

                  {canDelete && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Delete"
                      onPress={() => deletePhrase(phrase.id)}
                      style={({ pressed }) => ({
                        minHeight: 44,
                        minWidth: 64,
                        paddingHorizontal: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: colors.edge,
                        borderRadius: 22,
                        backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
                      })}
                    >
                      <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors.ink }}>
                        Delete
                      </TurnText>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          )
        })}

        {error && !editor && (
          <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            {error}
          </TurnText>
        )}

        {!isStrip && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add phrase"
            onPress={() => {
              setError(null)
              setEditor({
                id: null,
                text: '',
                categoryId,
                placeIds: []
              })
            }}
            style={({ pressed }) => ({
              minHeight: 52,
              borderRadius: 26,
              backgroundColor: pressed ? colors['accent-pressed'] : colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8
            })}
          >
            <TurnText kind="headline" boldText={boldText} style={{ color: colors['on-accent'] }}>
              Add phrase
            </TurnText>
          </Pressable>
        )}
      </ScrollView>

      {/* Undo bar stays at the bottom while any deletion is staged */}
      {hasUndo && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            minHeight: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderTopWidth: 2,
            borderTopColor: colors.edge,
            backgroundColor: colors.surface
          }}
        >
          <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
            Phrase deleted
          </TurnText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Undo"
            onPress={() => {
              void bank.undoDelete().catch((cause) => setError(String(cause)))
            }}
            style={({ pressed }) => ({
              minHeight: 44,
              minWidth: 64,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 14,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: colors.edge,
              backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
            })}
          >
            <TurnText kind="headline" boldText={boldText} style={{ color: colors.accent }}>
              Undo
            </TurnText>
          </Pressable>
        </View>
      )}

      {/* Add or Edit phrase sheet */}
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
              title={editor?.id ? 'Edit phrase' : 'Add phrase'}
              boldText={boldText}
              canSave={!!editor?.text.trim() && !saving}
              onCancel={() => {
                setEditor(null)
                setError(null)
              }}
              onSave={() => void save()}
            />

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ gap: 8 }}>
                <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
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
                  selectionColor={colors.accent}
                  scrollEnabled
                  style={{
                    ...textStyle('body', boldText),
                    minHeight: 78,
                    maxHeight: 180,
                    padding: 12,
                    borderWidth: 2,
                    borderColor: colors.edge,
                    borderRadius: 12,
                    color: colors.ink,
                    backgroundColor: colors.surface,
                    textAlignVertical: 'top'
                  }}
                />
                {!!editor && editor.text.length >= 180 && (
                  <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                    {200 - editor.text.length} characters left
                  </TurnText>
                )}
                {editor?.isFixed && (
                  <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                    Yes, No, and Not sure cannot be renamed.
                  </TurnText>
                )}
              </View>

              {/* Category selector (if not fixed and not strip) */}
              {!editor?.isFixed && !isStrip && (
                <View style={{ gap: 8 }}>
                  <TurnText
                    kind="subheadline-emphasized"
                    boldText={boldText}
                    style={{ color: colors['ink-secondary'] }}
                  >
                    Category
                  </TurnText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {categories.map((cat) => {
                      const selected = editor?.categoryId === cat.id
                      return (
                        <Pressable
                          key={cat.id}
                          accessibilityRole="button"
                          accessibilityLabel={cat.name}
                          accessibilityState={{ selected }}
                          onPress={() => setEditor((current) => (current ? { ...current, categoryId: cat.id } : null))}
                          style={({ pressed }) => ({
                            minHeight: 44,
                            paddingHorizontal: 16,
                            borderRadius: 22,
                            borderWidth: 2,
                            borderColor: colors.edge,
                            backgroundColor: selected
                              ? colors.ink
                              : pressed
                                ? colors['surface-pressed']
                                : colors.surface,
                            alignItems: 'center',
                            justifyContent: 'center'
                          })}
                        >
                          <TurnText
                            kind="subheadline-emphasized"
                            boldText={boldText}
                            style={{ color: selected ? colors.surface : colors.ink }}
                          >
                            {cat.name}
                          </TurnText>
                        </Pressable>
                      )
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Places selector */}
              {places.length > 0 && (
                <View style={{ gap: 8 }}>
                  <TurnText
                    kind="subheadline-emphasized"
                    boldText={boldText}
                    style={{ color: colors['ink-secondary'] }}
                  >
                    Places
                  </TurnText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {places.map((place) => {
                      const selected = editor?.placeIds.includes(place.id) ?? false
                      return (
                        <Pressable
                          key={place.id}
                          accessibilityRole="checkbox"
                          accessibilityLabel={place.name}
                          accessibilityState={{ selected, checked: selected }}
                          onPress={() => {
                            setEditor((current) => {
                              if (!current) return null
                              const nextPlaces = selected
                                ? current.placeIds.filter((p) => p !== place.id)
                                : [...current.placeIds, place.id]
                              return { ...current, placeIds: nextPlaces }
                            })
                          }}
                          style={({ pressed }) => ({
                            minHeight: 44,
                            paddingHorizontal: 16,
                            borderRadius: 22,
                            borderWidth: 2,
                            borderColor: colors.edge,
                            backgroundColor: selected
                              ? colors.ink
                              : pressed
                                ? colors['surface-pressed']
                                : colors.surface,
                            alignItems: 'center',
                            justifyContent: 'center'
                          })}
                        >
                          <TurnText
                            kind="subheadline-emphasized"
                            boldText={boldText}
                            style={{ color: selected ? colors.surface : colors.ink }}
                          >
                            {place.name}
                          </TurnText>
                        </Pressable>
                      )
                    })}
                  </View>
                </View>
              )}

              {error && (
                <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                  {error}
                </TurnText>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}
