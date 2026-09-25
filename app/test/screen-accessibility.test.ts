import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import * as ts from 'typescript'

const phraseBankSource = readFileSync(new URL('../src/screens/PhraseBankScreen.tsx', import.meta.url), 'utf8')
const categoriesSource = readFileSync(new URL('../src/screens/CategoriesScreen.tsx', import.meta.url), 'utf8')

function jsxElements(source: string, filename: string) {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const elements: Array<ts.JsxOpeningElement | ts.JsxSelfClosingElement> = []
  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) elements.push(node)
    node.forEachChild(visit)
  }
  visit(file)
  return elements
}

function attributeText(element: ts.JsxOpeningElement | ts.JsxSelfClosingElement, name: string) {
  const attribute = element.attributes.properties.find(
    (property): property is ts.JsxAttribute => ts.isJsxAttribute(property) && property.name.getText() === name
  )
  const initializer = attribute?.initializer
  if (!initializer) return undefined
  if (ts.isStringLiteral(initializer)) return initializer.text
  if (ts.isJsxExpression(initializer)) return initializer.expression?.getText()
  return initializer.getText()
}

describe('screen accessibility names', () => {
  test('phrase rows name the phrase, expose details as a value, and retain named actions', () => {
    const row = jsxElements(phraseBankSource, 'PhraseBankScreen.tsx').find(
      (element) =>
        element.tagName.getText() === 'Pressable' && attributeText(element, 'accessibilityActions') === 'actions'
    )
    expect(row).toBeDefined()
    expect(attributeText(row!, 'accessibilityLabel')).toBe('phrase.text')
    expect(attributeText(row!, 'accessibilityValue')).toBe('phraseDetails ? { text: phraseDetails } : undefined')
    expect(phraseBankSource).toContain("const phraseDetails = [placesText, phrase.reviewed === 0 ? 'Starter' : null]")
    expect(phraseBankSource).toContain("{ name: 'edit', label: 'Edit' }")
    expect(phraseBankSource).toContain("{ name: 'move-up', label: 'Move up' }")
    expect(phraseBankSource).toContain("{ name: 'move-down', label: 'Move down' }")
    expect(phraseBankSource).toContain("{ name: 'delete', label: 'Delete' }")
  })

  test('the strip row names its title and exposes the subtitle as a value', () => {
    const stripRow = jsxElements(categoriesSource, 'CategoriesScreen.tsx').find(
      (element) =>
        element.tagName.getText() === 'Pressable' &&
        attributeText(element, 'onPress')?.includes("router.push('/bank/strip')")
    )
    expect(stripRow).toBeDefined()
    expect(attributeText(stripRow!, 'accessibilityLabel')).toBe('Conversation strip')
    expect(attributeText(stripRow!, 'accessibilityValue')).toBe("{ text: 'Phrases always visible above the grid' }")
  })

  test('the phrase field uses its visible caption as the label and gives typing guidance as a hint', () => {
    const field = jsxElements(phraseBankSource, 'PhraseBankScreen.tsx').find(
      (element) => element.tagName.getText() === 'TextInput' && attributeText(element, 'maxLength') === '200'
    )
    expect(field).toBeDefined()
    expect(attributeText(field!, 'accessibilityLabel')).toBe('Phrase')
    expect(attributeText(field!, 'accessibilityHint')).toBe('Type the phrase you want to say, up to 200 characters.')
    expect(attributeText(field!, 'placeholder')).toBeUndefined()
  })
})
