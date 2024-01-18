import React from "react"

function InfoBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold">{title}</div>
      {children}
    </div>
  )
}

export default InfoBlock
