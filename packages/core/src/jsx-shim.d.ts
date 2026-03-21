import type { VNode } from 'vue'

declare module 'vue' {
  interface HTMLAttributes {
    children?: VNode | VNode[] | string | number | (VNode | string | number | undefined | false)[]
  }
}

export {}
