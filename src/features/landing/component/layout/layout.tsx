import React from "react"

function ClientLayout({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>
}

export default ClientLayout
