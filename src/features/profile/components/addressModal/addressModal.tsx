import React from "react"

import type { AddressI } from "@/types/api"
import {
  AlertDialog,
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
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AddressForm initialData={address} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddressModal
