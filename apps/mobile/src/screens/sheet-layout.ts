/** How far a page sheet's body must rise for its bottom to clear the keyboard. Inside a sheet a view measures against
 * the sheet, which starts `windowHeight - sheetHeight` below the top of the screen, while the keyboard's top is
 * measured against the screen. */
export function keyboardInset(
  windowHeight: number,
  sheetHeight: number,
  body: { y: number; height: number },
  keyboardTop: number
): number {
  return Math.max(0, Math.round(windowHeight - sheetHeight + body.y + body.height - keyboardTop))
}
