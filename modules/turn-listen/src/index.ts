import { requireOptionalNativeModule } from 'expo'

export type NameKind = 'person' | 'place' | 'org'

export type NameSpan = { kind: NameKind; start: number; end: number }

type NativeTurnListenModule = {
  findNames(texts: string[]): Promise<NameSpan[][]>
  setGazetteer(person: string[], place: string[], org: string[]): Promise<void>
}

export type TurnListen = {
  findNames(texts: readonly string[]): Promise<readonly (readonly NameSpan[])[]>
  setGazetteer(person: readonly string[], place: readonly string[], org: readonly string[]): Promise<void>
}

const native = requireOptionalNativeModule<NativeTurnListenModule>('TurnListen')

export const turnListen: TurnListen | null = native
  ? {
      findNames: (texts) => native.findNames([...texts]),
      setGazetteer: (person, place, org) => native.setGazetteer([...person], [...place], [...org])
    }
  : null
