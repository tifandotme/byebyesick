import React from "react"

function DoctorDetailBlock({
  title,
  content,
}: {
  title: string
  content: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm capitalize">{content}</div>
    </div>
  )
}

export default DoctorDetailBlock
