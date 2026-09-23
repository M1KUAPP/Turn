/** A clock minute, in milliseconds. */
const minute = 60_000

/** Creates an object's count of its requests in the current clock minute: one row, which a new minute starts again. */
export function createMinuteCount(sql: SqlStorage) {
  sql.exec(
    'CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY CHECK (id = 1), minute INTEGER NOT NULL, ' +
      'count INTEGER NOT NULL)'
  )
}

/**
 * Counts one more request in the current clock minute, or none once `limit` are counted there: whether this one may go
 * on (SEC-3). It runs in one transaction, with no `await`, so simultaneous requests can't share the last.
 */
export function countInMinute(storage: DurableObjectStorage, limit: number): boolean {
  return storage.transactionSync(() => {
    const { sql } = storage
    const thisMinute = Math.floor(Date.now() / minute)
    const row = sql.exec<{ minute: number; count: number }>('SELECT minute, count FROM requests').toArray()[0]
    const count = row?.minute === thisMinute ? row.count : 0
    if (count >= limit) return false
    sql.exec(
      'INSERT INTO requests (id, minute, count) VALUES (1, ?, ?) ' +
        'ON CONFLICT (id) DO UPDATE SET minute = excluded.minute, count = excluded.count',
      thisMinute,
      count + 1
    )
    return true
  })
}
