import React, { useState } from "react"
import { XIcon } from "lucide-react"

import type { AddressIForm } from "@/types/api"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import AddressForm from "@/features/profile/components/form/addressForm"

function AddressModal({
  trigger,
  title,
  address,
}: {
  trigger: React.ReactNode
  title: string
  address?: AddressIForm
}) {
  const [open, setIsOpen] = useState<boolean>(false)
  return (
    <AlertDialog open={open}>
      <Button
        variant={"ghost"}
        size={"sm"}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {trigger}
      </Button>
      <AlertDialogContent className="h-1/2 w-5/6 overflow-auto">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <Button
            variant={"ghost"}
            className="hover:bg-transparent"
            size={"sm"}
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <XIcon className="p-0" />
          </Button>
        </AlertDialogHeader>
        <AddressForm initialData={address} setIsOpen={setIsOpen} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddressModal
