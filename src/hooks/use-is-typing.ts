import React from "react"

export interface UseIsTypingProps {
  /**
   * Time in milliseconds before typing indicator gets reset. **Default:** `1000`
   */
  timeout?: number
}

export type TextElement = HTMLInputElement | HTMLTextAreaElement

export type RegisterElement = <Element extends TextElement = TextElement>(
  el: Element | null,
) => void

export function useIsTyping({ timeout = 1000 }: UseIsTypingProps = {}): [
  boolean,
  RegisterElement,
] {
  const [isTyping, setIsTyping] = React.useState(false)
  const [currentEl, setCurrentEl] = React.useState<TextElement | null>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, timeout)
  }, [timeout])

  const register: RegisterElement = React.useCallback((el) => {
    setCurrentEl(el)
    if (!el) {
      setIsTyping(false)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    setIsTyping(false)
    if (!currentEl) {
      return
    }

    const keyUpDownListener = (e: Event) => {
      const hasValue = (e.target as TextElement).value !== ""

      setIsTyping(hasValue)
      reset()
    }
    const blurListener = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsTyping(false)
    }

    currentEl.addEventListener("keyup", keyUpDownListener)
    currentEl.addEventListener("keydown", keyUpDownListener)
    currentEl.addEventListener("blur", blurListener)

    return () => {
      currentEl.removeEventListener("keydown", keyUpDownListener)
      currentEl.removeEventListener("keyup", keyUpDownListener)
      currentEl.removeEventListener("blur", blurListener)
    }
  }, [currentEl, reset])

  return [isTyping, register]
}
