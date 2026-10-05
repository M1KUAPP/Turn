/**
 * A command's flags, as `--name value` or `--name=value`, among the names it takes, or null for anything else: an
 * unknown flag, a flag without its value, or a word on its own. Node's `parseArgs` would do, but the Workers runtime
 * that runs the tests doesn't implement it.
 */
export function readFlags<Name extends string>(
  args: readonly string[],
  names: readonly Name[]
): Partial<Record<Name, string>> | null {
  const flags: Partial<Record<Name, string>> = {}
  for (let i = 0; i < args.length; i++) {
    const [, name, inline] = /^--([a-z]+)(?:=(.*))?$/s.exec(args[i]) ?? []
    const value = inline ?? args[++i]
    if (!names.includes(name as Name) || value === undefined) return null
    flags[name as Name] = value
  }
  return flags
}
