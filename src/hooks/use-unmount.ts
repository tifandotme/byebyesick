import React from "react"

export function useUnmount(fn: () => any) {
  const fnRef = React.useRef(fn)

  fnRef.current = fn

  React.useEffect(() => () => fnRef.current(), [])
}
