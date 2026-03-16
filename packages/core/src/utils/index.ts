export type Mod = string | { [key: string]: any }
export type Mods = Mod | Mod[]

function genBem(name: string, mods?: Mods): string {
  if (!mods) return ''
  if (typeof mods === 'string') return ` ${name}--${mods}`
  if (Array.isArray(mods)) {
    return (mods as string[]).reduce((ret, item) => ret + genBem(name, item), '')
  }
  return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? genBem(name, key) : ''), '')
}

export function createBEM(name: string) {
  return (el?: Mods, mods?: Mods): string => {
    if (el && typeof el !== 'string') {
      mods = el
      el = ''
    }
    el = el ? `${name}__${el}` : name
    return `${el}${genBem(el, mods)}`
  }
}

export function createNamespace(name: string) {
  const prefixedName = `v3sf-${name}`
  return [prefixedName, createBEM(prefixedName)] as const
}

let idx = 36
let hex = ''
while (idx--) hex += idx.toString(36)

export function uid(len = 11): string {
  let str = ''
  let num = len
  while (num--) str += hex[(Math.random() * 36) | 0]
  return str
}

export function isObject(val: unknown): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

export function isJsonSchema(schema: any): boolean {
  return isObject(schema) && schema.type === 'object' && isObject(schema.properties)
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce(
    (ret, key) => {
      if (obj[key] !== undefined) {
        ret[key] = obj[key]
      }
      return ret
    },
    {} as Pick<T, K>,
  )
}
