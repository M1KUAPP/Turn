const deadline = Date.now() + 60_000

while (Date.now() < deadline) {
  // BANK-9 deliberately holds the staged deletion for one full minute.
}
