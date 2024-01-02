export const truncate = (length: number, text: string) => {
  if (text.length > length) {
    return text.substring(0, Math.min(length, text.length)).concat("....")
  }
  return text
}
