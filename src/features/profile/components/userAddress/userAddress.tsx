import React from "react"

import type { AddressI } from "@/types/api"
import { Button } from "@/components/ui/button"
import AddressModal from "@/features/profile/components/addressModal/addressModal"

function UserAddress(address: AddressI) {
  return (
    <div className="flex w-full flex-row justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <h2>{address.name}</h2>|
          <h3 className="text-muted-foreground">{address.city}</h3>
        </div>
        <div className="text-sm text-muted-foreground">{address.address}</div>
        <div className="w-fit rounded-sm border-2 border-accent px-2 py-1 text-muted-foreground">
          main
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AddressModal
          title={"Edit Address"}
          trigger={
            <Button type="button" variant={"ghost"}>
              Edit
            </Button>
          }
          address={address}
        />
        <Button variant={"destructive"}>Delete</Button>
      </div>
    </div>
  )
}

export default UserAddress
