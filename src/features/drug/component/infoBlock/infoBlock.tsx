import React from "react"

function InfoBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>{title}</div>
      {children}
    </div>
  )
}

export default InfoBlock
