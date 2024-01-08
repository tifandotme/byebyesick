import React from "react"
import { XIcon } from "lucide-react"

import type { AddressI } from "@/types/api"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AddressForm from "@/features/profile/components/form/addressForm"

function AddressModal({
  trigger,
  title,
  address,
}: {
  trigger: React.ReactNode
  title: string
  address?: AddressI
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center gap-2">
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="h-1/2 overflow-auto">
        <AlertDialogHeader className="flex flex-row justify-between">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogCancel className="border-0 p-0">
            <XIcon className="p-0" />
          </AlertDialogCancel>
        </AlertDialogHeader>
        <AddressForm initialData={address} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddressModal
