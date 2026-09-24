import { useEffect, useState } from 'react'
import {
  ActionSheetIOS,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import type { Category } from '../bank/store'
import { colors, scaledTextStyle } from '../constants/theme'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

type Editor = { id: string | null; name: string }

export default function CategoriesScreen() {
  const router = useRouter()
  const { ready, boldText, fontScale } = useTurn()
  const bank = ready?.bank
  const [categories, setCategories] = useState<Category[]>([])
  const [editor, setEditor] = useState<Editor | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bank) return
    let active = true
    const read = () => {
      void bank.categories().then((nextCategories) => {
        if (!active) return
        setCategories(nextCategories)
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
    void bank.moveCategory(id, direction).catch((cause) => setError(String(cause)))
  }

  const confirmDelete = async (category: Category) => {
    if (!bank) return
    try {
      const phrases = await bank.phrases(category.id)
      const otherCategories = categories.filter((c) => c.id !== category.id)
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
        const options = [...otherCategories.map((c) => c.name), 'Cancel']
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: `Delete ${category.name}?`,
            message: 'Choose where its phrases will go.',
            options,
            cancelButtonIndex: otherCategories.length
          },
          (index) => {
            if (index < otherCategories.length) {
              const destination = otherCategories[index]
              void bank.deleteCategory(category.id, destination.id).catch((cause) => setError(String(cause)))
            }
          }
        )
      }
    } catch (cause) {
      setError(String(cause))
    }
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

  // Count check: at most 12 categories counting strip and counting Typed even before it exists
  const hasTyped = categories.some((c) => c.id === 'typed')
  const atCategoryLimit = hasTyped ? categories.length >= 11 : categories.length >= 10

  if (!bank) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board, padding: 16 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          Loading phrase bank…
        </TurnText>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
        <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
          Categories organize your phrases. Move categories here to change the tab order.
        </TurnText>

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

          return (
            <View
              key={category.id}
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
                accessibilityLabel={`${category.name}, category. Open`}
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
                style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
                    {category.name}
                  </TurnText>
                </View>
                <SymbolView name="chevron.right" size={15} tintColor={colors['ink-secondary']} accessible={false} />
              </Pressable>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: 'Move up', offered: canMoveUp, action: () => move(category.id, -1) },
                  { label: 'Move down', offered: canMoveDown, action: () => move(category.id, 1) },
                  {
                    label: 'Rename',
                    offered: true,
                    action: () => {
                      setError(null)
                      setEditor({ id: category.id, name: category.name })
                    }
                  },
                  { label: 'Delete', offered: canDelete, action: () => void confirmDelete(category) }
                ]
                  .filter(({ offered }) => offered)
                  .map(({ label, action }) => (
                    <Pressable
                      key={label}
                      accessibilityRole="button"
                      accessibilityLabel={`${label} ${category.name}`}
                      onPress={action}
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
                        {label}
                      </TurnText>
                    </Pressable>
                  ))}
              </View>
            </View>
          )
        })}

        {/* The strip shows last, apart, as a row that opens its phrases */}
        <View style={{ marginTop: 8, gap: 8 }}>
          <TurnText
            kind="subheadline-emphasized"
            boldText={boldText}
            style={{ color: colors['ink-secondary'], marginLeft: 4 }}
          >
            Conversation strip
          </TurnText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Conversation strip. Open phrases"
            onPress={() => router.push('/bank/strip')}
            style={({ pressed }) => ({
              minHeight: 52,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              borderRadius: 12,
              backgroundColor: pressed ? colors['surface-pressed'] : colors.surface,
              borderWidth: 2,
              borderColor: colors.edge
            })}
          >
            <View style={{ gap: 4 }}>
              <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
                Conversation strip
              </TurnText>
              <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                Phrases always visible above the grid
              </TurnText>
            </View>
            <SymbolView name="chevron.right" size={15} tintColor={colors['ink-secondary']} accessible={false} />
          </Pressable>
        </View>

        {error && !editor && (
          <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['no-edge'] }}>
            {error}
          </TurnText>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add category"
          accessibilityState={{ disabled: atCategoryLimit }}
          disabled={atCategoryLimit}
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
            opacity: atCategoryLimit ? 0.45 : 1
          })}
        >
          <TurnText kind="headline" boldText={boldText} style={{ color: colors['on-accent'] }}>
            Add category
          </TurnText>
        </Pressable>

        {atCategoryLimit && (
          <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            You can have up to 12 categories.
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
                {editor?.id ? 'Rename category' : 'Add category'}
              </TurnText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save category"
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
              accessibilityLabel="Category name"
              allowFontScaling={false}
              maxLength={40}
              value={editor?.name ?? ''}
              onChangeText={(name) =>
                setEditor((current) => (current ? { ...current, name: name.slice(0, 40) } : null))
              }
              placeholder="Category name"
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
