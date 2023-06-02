
export function isPresent (value: any): boolean {
  return value !== undefined && value !== null
}

export function isAbsent (value: any): boolean {
  return !isPresent(value)
}
