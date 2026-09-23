import { DurableObject } from 'cloudflare:workers'

/** The relay's one count of calls to Jev in the UTC day, retries included, which each user's object asks (SEC-5). */
export class Budget extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    // Only the current day's count, which a new UTC day starts again from 0.
    ctx.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS calls (id INTEGER PRIMARY KEY CHECK (id = 1), day TEXT NOT NULL, ' +
        'count INTEGER NOT NULL)'
    )
  }

  /**
   * Takes one of the day's `limit` calls, or none once they're all taken: whether the call may go to Jev. It runs in
   * one transaction, with no `await`, so simultaneous calls can't take the same one.
   */
  take(limit: number): boolean {
    return this.ctx.storage.transactionSync(() => {
      const { sql } = this.ctx.storage
      const day = new Date().toISOString().slice(0, 10)
      const row = sql.exec<{ day: string; count: number }>('SELECT day, count FROM calls').toArray()[0]
      const count = row?.day === day ? row.count : 0
      if (count >= limit) return false
      sql.exec(
        'INSERT INTO calls (id, day, count) VALUES (1, ?, ?) ' +
          'ON CONFLICT (id) DO UPDATE SET day = excluded.day, count = excluded.count',
        day,
        count + 1
      )
      return true
    })
  }
}
