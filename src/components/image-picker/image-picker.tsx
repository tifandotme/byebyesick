import React, { useState } from "react"
import Image from "next/image"
import { ArrowDownIcon, ImageDownIcon } from "lucide-react"

import { imageLoader } from "../image-loader"

const ImagePicker = ({
  onChange,
  handleDrop,
  image,
}: {
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  handleDrop: (files: File) => void
  image?: string
}) => {
  const [dragging, setDragging] = useState(false)

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
    e.dataTransfer.dropEffect = "copy"
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const selectedFiles = e.dataTransfer.files
    if (onChange && selectedFiles[0]) {
      handleDrop(selectedFiles[0])
    }
  }

  return (
    <div
      className="flex flex-col items-center gap-7 rounded-md border border-dashed border-blue-500 bg-gray-50 px-7 py-9"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={image}
            width={500}
            height={500}
            className="max-h-44 object-contain"
            loader={imageLoader}
          />
        </>
      ) : (
        <></>
      )}
      {image ? (
        <></>
      ) : dragging ? (
        <ArrowDownIcon className="size-10 text-gray-400" />
      ) : (
        <ImageDownIcon className="size-10 text-gray-400" />
      )}
      <div className="flex flex-col items-center">
        {image ? (
          <></>
        ) : dragging ? (
          <p className="text-primary">Drop Here</p>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-secondary-foreground">
              <span className="text-blue-500 ">Drop </span> your files here or{" "}
              <span className="font-medium text-blue-500">
                <label className="cursor-pointer" htmlFor="image">
                  browse
                </label>
              </span>
            </p>
            <p className="text-sm text-gray-400">
              only support png or jpg file
            </p>
          </div>
        )}
      </div>
      <input
        accept="image/png, image/jpeg"
        type="file"
        onChange={onChange}
        className="hidden"
        name="image"
        id="image"
      />
    </div>
  )
}

export default ImagePicker
