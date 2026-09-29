import { useEffect, useState } from 'react'
import { Alert, Modal, Pressable, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import type { Category } from '../bank/store'
import { colors, textStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import Button from './Button'
import { categoryHue, categorySymbol } from './category-style'
import IconButton from './IconButton'
import {
  GroupHeader,
  GroupNote,
  ListGroup,
  ListRow,
  ScreenTitle,
  SymbolTile,
  tileTones,
  useListMetrics
} from './ListGroup'
import SheetHeader, { SheetActions, SheetBody } from './SheetHeader'
import TurnText from './TurnText'

type Editor = { id: string | null; name: string }

export default function CategoriesScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const { ready, boldText } = useTurn()
  const { tile, mark } = useListMetrics()
  const bank = ready?.bank
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [editMode, setEditMode] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bank) return
    let active = true
    const read = () => {
      void Promise.all([bank.categories(), bank.phrases('all')]).then(([nextCategories, phrases]) => {
        if (!active) return
        setCategories(nextCategories)
        const nextCounts: Record<string, number> = {}
        for (const phrase of phrases) nextCounts[phrase.category_id] = (nextCounts[phrase.category_id] ?? 0) + 1
        setCounts(nextCounts)
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      active = false
      unsubscribe()
    }
  }, [bank])

  // Count check: at most 12 categories counting strip and counting Typed even before it exists
  const hasTyped = categories.some((c) => c.id === 'typed')
  const atCategoryLimit = hasTyped ? categories.length >= 11 : categories.length >= 10

  useEffect(() => {
    navigation.setOptions({
      // Native bar buttons, like the back button beside them, so iOS keeps them at bar size at every text size.
      unstable_headerRightItems: () =>
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
                label: 'Add category',
                accessibilityLabel: 'Add category',
                icon: { type: 'sfSymbol', name: 'plus' },
                variant: 'prominent',
                tintColor: colors.accent,
                disabled: !bank || atCategoryLimit,
                onPress: () => {
                  setError(null)
                  setEditor({ id: null, name: '' })
                }
              }
            ]
    })
  }, [navigation, editMode, bank, atCategoryLimit])

  const move = (id: string, direction: -1 | 1) => {
    if (!bank) return
    void bank.moveCategory(id, direction).catch((cause) => setError(String(cause)))
  }

  const confirmDelete = async (category: Category) => {
    if (!bank) return
    try {
      const phrases = await bank.phrases(category.id)
      if (phrases.length === 0) {
        Alert.alert(`Delete ${category.name}?`, 'This category is empty.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              void bank.deleteCategory(category.id).catch((cause) => setError(String(cause)))
            }
          }
        ])
      } else {
        setDeleting(category)
      }
    } catch (cause) {
      setError(String(cause))
    }
  }

  const deleteInto = (destination: Category) => {
    if (!bank || !deleting) return
    const doomed = deleting
    setDeleting(null)
    void bank.deleteCategory(doomed.id, destination.id).catch((cause) => setError(String(cause)))
  }

  const closeEditor = () => {
    setEditor(null)
    setError(null)
  }

  const save = async () => {
    if (!bank || !editor || saving) return
    setSaving(true)
    setError(null)
    try {
      if (editor.id) await bank.renameCategory(editor.id, editor.name)
      else await bank.addCategory(editor.name)
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
          Loading phrase bank…
        </TurnText>
      </SafeAreaView>
    )
  }

  const ids = categories.map((category) => category.id)

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: colors.board }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 22 }}
      >
        <View style={{ gap: 8 }}>
          <ScreenTitle title="Phrase bank" boldText={boldText} />
          <TurnText
            kind="footnote"
            boldText={boldText}
            style={{ color: colors['ink-secondary'], marginHorizontal: 4, marginTop: 6 }}
          >
            Categories organize your phrases. Move categories here to change the tab order.
          </TurnText>
        </View>

        {/* The strip comes first, apart, as a row that opens its phrases */}
        <View
          style={{
            borderRadius: 24,
            borderCurve: 'continuous',
            borderWidth: 1.5,
            borderColor: colors.edge,
            backgroundColor: colors.surface,
            overflow: 'hidden'
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Conversation strip"
            accessibilityValue={{ text: 'Phrases always visible above the grid' }}
            accessibilityHint="Opens its phrases."
            onPress={() => router.push('/bank/strip')}
            style={({ pressed }) => ({
              minHeight: 62,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: pressed ? colors['surface-pressed'] : undefined
            })}
          >
            <SymbolTile symbol={categorySymbol('strip')} tone={tileTones.neutral} />
            <View style={{ flex: 1, gap: 2 }}>
              <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
                Conversation strip
              </TurnText>
              <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                Phrases always visible above the grid
              </TurnText>
            </View>
            <SymbolView
              name="chevron.right"
              size={mark}
              weight="semibold"
              tintColor={colors['ink-secondary']}
              accessible={false}
            />
          </Pressable>
        </View>

        <View>
          <GroupHeader title="Categories" boldText={boldText} />
          <ListGroup>
            {categories.map((category, index) => {
              const isQuick = category.id === 'quick'
              const isBelowQuick = index === 1
              const isBodyPain = category.id === 'body-pain'

              const canMoveUp = !isQuick && !isBelowQuick && index > 0
              const canMoveDown = !isQuick && index < categories.length - 1
              const canDelete = !isQuick && !isBodyPain

              const actions = [
                { name: 'open', label: 'Open' },
                ...(canMoveUp ? [{ name: 'move-up', label: 'Move up' }] : []),
                ...(canMoveDown ? [{ name: 'move-down', label: 'Move down' }] : []),
                { name: 'rename', label: 'Rename' },
                ...(canDelete ? [{ name: 'delete', label: 'Delete' }] : [])
              ]
              const hue = categoryHue(category.id, ids)
              const count = counts[category.id] ?? 0

              return (
                <View key={category.id}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={category.name}
                    accessibilityValue={{ text: `${count} ${count === 1 ? 'phrase' : 'phrases'}` }}
                    accessibilityHint="Opens this category's phrases."
                    accessibilityActions={actions}
                    onAccessibilityAction={(event) => {
                      if (event.nativeEvent.actionName === 'open') router.push(`/bank/${category.id}`)
                      if (event.nativeEvent.actionName === 'move-up') move(category.id, -1)
                      if (event.nativeEvent.actionName === 'move-down') move(category.id, 1)
                      if (event.nativeEvent.actionName === 'rename') {
                        setError(null)
                        setEditor({ id: category.id, name: category.name })
                      }
                      if (event.nativeEvent.actionName === 'delete') void confirmDelete(category)
                    }}
                    onPress={() => router.push(`/bank/${category.id}`)}
                    style={({ pressed }) => ({
                      minHeight: 56,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      backgroundColor: pressed ? colors['surface-pressed'] : undefined
                    })}
                  >
                    <SymbolTile symbol={categorySymbol(category.id)} tone={{ fill: hue.fill, ink: hue.edge }} />
                    <TurnText kind="body" boldText={boldText} style={{ flex: 1, color: colors.ink }}>
                      {category.name}
                    </TurnText>
                    <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                      {count}
                    </TurnText>
                    <SymbolView
                      name="chevron.right"
                      size={mark}
                      weight="semibold"
                      tintColor={colors['ink-secondary']}
                      accessible={false}
                    />
                  </Pressable>

                  {/* Edit mode's buttons sit under the name, one tap each, never a drag (A11Y-5, A11Y-8). */}
                  {editMode && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 10,
                        paddingLeft: 16 + tile + 12,
                        paddingRight: 16,
                        paddingBottom: 12
                      }}
                    >
                      {canMoveUp && (
                        <IconButton symbol="chevron.up" label="Move up" onPress={() => move(category.id, -1)} />
                      )}
                      {canMoveDown && (
                        <IconButton symbol="chevron.down" label="Move down" onPress={() => move(category.id, 1)} />
                      )}
                      <IconButton
                        symbol="pencil"
                        label="Rename"
                        onPress={() => {
                          setError(null)
                          setEditor({ id: category.id, name: category.name })
                        }}
                      />
                      {canDelete && (
                        <IconButton
                          symbol="trash"
                          label="Delete"
                          tint={colors['no-edge']}
                          onPress={() => void confirmDelete(category)}
                        />
                      )}
                    </View>
                  )}
                </View>
              )
            })}
          </ListGroup>
          {atCategoryLimit && <GroupNote boldText={boldText}>You can have up to 12 categories.</GroupNote>}
          {error && !editor && <GroupNote boldText={boldText}>{error}</GroupNote>}
        </View>
      </ScrollView>
      <Modal visible={!!editor} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeEditor}>
        <SheetBody>
          <SheetHeader
            title={editor?.id ? 'Rename category' : 'Add category'}
            boldText={boldText}
            onClose={closeEditor}
          />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 12 }}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              autoFocus
              accessibilityLabel="Category name"
              maxLength={40}
              value={editor?.name ?? ''}
              onChangeText={(name) =>
                setEditor((current) => (current ? { ...current, name: name.slice(0, 40) } : null))
              }
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Category name"
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
            {!editor?.id && (
              <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                New categories take the next color in the set.
              </TurnText>
            )}
            {!!editor && editor.name.length >= 35 && (
              <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                {40 - editor.name.length} characters left
              </TurnText>
            )}
            {error && (
              <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                {error}
              </TurnText>
            )}
          </ScrollView>
          <SheetActions>
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

      {/* Deleting a category that holds phrases asks where they go; choosing a category moves them and deletes. */}
      <Modal
        visible={!!deleting}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDeleting(null)}
      >
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
          <SheetHeader
            title={`Delete ${deleting?.name ?? ''}?`}
            boldText={boldText}
            onClose={() => setDeleting(null)}
          />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 16 }}>
            <TurnText kind="body" boldText={boldText} style={{ color: colors.ink, marginHorizontal: 4 }}>
              Choose where its phrases will go.
            </TurnText>
            <ListGroup>
              {categories
                .filter((category) => category.id !== deleting?.id)
                .map((category) => {
                  const hue = categoryHue(category.id, ids)
                  return (
                    <ListRow
                      key={category.id}
                      label={category.name}
                      boldText={boldText}
                      symbol={categorySymbol(category.id)}
                      tone={{ fill: hue.fill, ink: hue.edge }}
                      accessibilityHint={`Moves the phrases to ${category.name} and deletes ${deleting?.name ?? ''}.`}
                      onPress={() => deleteInto(category)}
                    />
                  )
                })}
            </ListGroup>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  )
}
