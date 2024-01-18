import React from "react"

import { isBrowser } from "@/lib/utils"
import { useRafState } from "@/hooks/use-raf-state"

function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["addEventListener"]> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement["addEventListener"]>),
    )
  }
}

function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args:
    | Parameters<T["removeEventListener"]>
    | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement["removeEventListener"]>),
    )
  }
}

/**
 * @link https://github.com/streamich/react-use/blob/master/src/useWindowScroll.ts
 */
export function useWindowScroll() {
  const [state, setState] = useRafState<{
    x: number
    y: number
  }>(() => ({
    x: isBrowser() ? window.scrollX : 0,
    y: isBrowser() ? window.scrollY : 0,
  }))

  React.useEffect(() => {
    const handler = () => {
      setState((state) => {
        const { scrollX, scrollY } = window
        return state.x !== scrollX || state.y !== scrollY
          ? {
              x: scrollX,
              y: scrollY,
            }
          : state
      })
    }

    handler()

    on(window, "scroll", handler, {
      capture: false,
      passive: true,
    })

    return () => {
      off(window, "scroll", handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
