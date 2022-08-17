export type Nullable<T> = T | null

export type CommonRef<EL = HTMLElement> = EL & {
  show: () => void
  close: () => void
}
