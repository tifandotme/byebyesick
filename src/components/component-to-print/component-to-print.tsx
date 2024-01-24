import React from "react"

const ComponentToPrint = React.forwardRef((prop: any, ref: any) => {
  return <div ref={ref}>{prop.children}</div>
})

ComponentToPrint.displayName = "ComponentToPrint"

export default ComponentToPrint
